#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <vorbis/codec.h>
#include <vorbis/vorbisfile.h>

#include "AS3.h"

/*****************************************************************************
 * Bridge to provide ActionScript 3 with OggVorbis decoding capabilities
 *
 * Author: Branden Hall (bhall@automatastudios.com)
 ****************************************************************************/

/* Define a structure to maintain an AS3 ByteArray and it's state */
typedef struct {
	AS3_Val dataVal;
	int 	position;
	int 	length;
	double 	totalTime;
}  vf_as3_file;

/*****************************************************************************
 * Math functions (should be in FlaCC)
 ****************************************************************************/

/* Implementation of rint (round to integral value) */
double rint(double x) {
  return ( (x<0.)? -floor(-x+.5):floor(x+.5) );
}

/* Implementation of rintf (round to integral value) */
float rintf(float x) {
  return ( (x<(float)0.)? -(float)floor(-x+.5):(float)floor(x+.5) );
}

/*****************************************************************************
 * Callbacks for vorbisfile non-file i/o
 ****************************************************************************/

/* Handle reading data from a ByteArray */
size_t readByteArray(void *ptr, size_t size, size_t nmemb, void *datasource)
{
	unsigned int	bytesAvailable;
	AS3_Val			bytesAvailableVal;
	AS3_Val			lastPositionVal;
	size_t			actualSizeToRead;
	vf_as3_file		*audioData;

	/* initialize the AS3 values */
	bytesAvailableVal = AS3_Undefined();
	lastPositionVal = AS3_Undefined();

	/* get the data as the correct type */
	audioData = (vf_as3_file *)datasource;

	/* store the current position */
	lastPositionVal = AS3_GetS(audioData->dataVal, "position");

	/* move to where we actually want to read from */
	AS3_SetS(audioData->dataVal, "position", AS3_Int(audioData->position));

	/* get the bytes available in the actual bytearray */
	bytesAvailableVal = AS3_GetS(audioData->dataVal, "bytesAvailable");
	bytesAvailable = AS3_IntValue(bytesAvailableVal);

	/* first make sure we're not at the end of the data */
	if (audioData->position < audioData->length) {

		/* calculate the actual amount to read */
		actualSizeToRead = size * nmemb;

		/* make sure we have enough data to read */
		if (actualSizeToRead > bytesAvailable) {
			actualSizeToRead = bytesAvailable;
		}

		/* read the bytes into the pointer */
		AS3_ByteArray_readBytes(ptr, audioData->dataVal, actualSizeToRead);

		audioData->position += actualSizeToRead;

	} else {

		/* we're at the end of the file, return 0 */
		actualSizeToRead = 0;
	}

	/* jump back to where the position used to be */
	AS3_SetS(audioData->dataVal, "position", lastPositionVal);

	/* release the AS3 values */
	AS3_Release(bytesAvailableVal);
	AS3_Release(lastPositionVal);

	return actualSizeToRead;
}

/* Handle seeking within a ByteArray */
int seekByteArray(void *datasource, ogg_int64_t offset, int whence)
{
	ogg_int64_t		actualOffset;
	vf_as3_file 	*audioData;
	AS3_Val			availableLengthVal;

	/* initialize the AS3 values */
	availableLengthVal = AS3_Undefined();

	/* get the data as the correct type */
	audioData = (vf_as3_file*)datasource;

	/* default actual offset to the current position */
	actualOffset = audioData->position;

	switch (whence) {
		/* start at the beginning of the ByteArray */
		case SEEK_SET:
			actualOffset = offset;
			break;

		/* start at the current position */
		case SEEK_CUR:
			actualOffset = audioData->position + offset;
			break;

		/* start at the end of the file */
		case SEEK_END:
			actualOffset = audioData->length + offset;
			break;
	}

	/* make sure we don't over or under seek */
	if (actualOffset > audioData->length) {
		actualOffset = audioData->length;
	}

	if (actualOffset < 0) {
		actualOffset = 0;
	}

	/* set the position */
	audioData->position = (unsigned int)actualOffset;

	return 0;
}

/* Handle finding the position within a ByteArray */
long tellByteArray(void *datasource)
{
	vf_as3_file *audioData;

	/* get the data as the correct type */
	audioData = (vf_as3_file*)datasource;

	/* return the current position */
	return audioData->position;
}

/*****************************************************************************
 * Functions provided to ActionScript
 ****************************************************************************/

/* Setup the OggVorbis decoder (using vorbisfile) */
AS3_Val setupDecoder(void *data, AS3_Val args)
{
	double			length;
	int 			result;
	OggVorbis_File 	vf;
	ov_callbacks 	callbacks;
	vf_as3_file 	audioData;
	AS3_Val 		dataVal;

	/* initialze the AS3 values */
	dataVal = AS3_Undefined();

	/* setup the callbacks for vorbisfile */
	callbacks.read_func = readByteArray;
	callbacks.seek_func = NULL;
	callbacks.close_func = NULL;
	callbacks.tell_func = NULL;

	/* pull out the passed in ByteArray */
	AS3_ArrayValue(args, "AS3ValType, DoubleType", &dataVal, &length);

	/* build the audioData structure */
	audioData.dataVal = dataVal;
	audioData.position = 0;
	audioData.length = (long)length;

	/* create the vorbisfile instance */
	result = ov_open_callbacks(&audioData, &vf, NULL, 0, callbacks);

	audioData.totalTime = ov_time_total(&vf, -1);

	/* if there was an error return the error value */
	if (result < 0) {
		return AS3_Number(result);
	}

	/* otherwise return pointer to the vorbisfile instance */
	else {
		return AS3_Number((long)&vf);
	}
}

/* Get the header information about the current vorbis file */
AS3_Val getHeader(void *data, AS3_Val args)
{
	unsigned int 	vf_address;
	unsigned int 	position;
	unsigned int 	length;
	unsigned int 	bytesAvailable;
	OggVorbis_File 	*vf_ptr;
	vorbis_info 	*vi_ptr;
	AS3_Val 		channelsVal;
	AS3_Val			sampleRateVal;
	AS3_Val			bitRateUpperVal;
	AS3_Val			bitRateLowerVal;
	AS3_Val			bitRateNominalVal;
	AS3_Val			commentListVal;
	int				index;
	char			**comment_ptr;

	/* pull out the arguments and create a pointer to our instance */
	AS3_ArrayValue(args, "IntType", &vf_address);
	vf_ptr = (OggVorbis_File *)(unsigned int)vf_address;

	/* create a pointer to the vorbisinfo */
    vi_ptr = ov_info(vf_ptr,-1);

    /* pull out the channel and sample rate information */
	channelsVal = AS3_Int(vi_ptr->channels);
	sampleRateVal = AS3_Int(vi_ptr->rate);
	bitRateUpperVal = AS3_Number(vi_ptr->bitrate_upper);
	bitRateLowerVal = AS3_Number(vi_ptr->bitrate_lower);
	bitRateNominalVal = AS3_Number(vi_ptr->bitrate_nominal);
	commentListVal = AS3_Array("");

	/* pull out the comment information */
	index = 0;
    comment_ptr = ov_comment(vf_ptr, -1)->user_comments;
    while(*comment_ptr){
    	AS3_Set(commentListVal, AS3_Int(index), AS3_String(*comment_ptr));
    	++comment_ptr;
    	++index;
    }

    /* package up the data into a nice, neat AS3 object */
    AS3_Val result = AS3_Object("channels: AS3ValType", channelsVal);
    AS3_SetS(result, "sampleRate", sampleRateVal);
    AS3_SetS(result, "bitRateUpper", bitRateUpperVal);
    AS3_SetS(result, "bitRateLower", bitRateLowerVal);
    AS3_SetS(result, "bitRateNominal", bitRateNominalVal);
    AS3_SetS(result, "commentList", commentListVal);

	/* release the created AS3 values */
	AS3_Release(channelsVal);
	AS3_Release(sampleRateVal);
	AS3_Release(commentListVal);

	return result;
}

/* Decode some samples */
AS3_Val getSampleData(void *data, AS3_Val args)
{
	OggVorbis_File 	*vf_ptr;
	int 			bytes_read;
	int 			total_bytes_read;
	int				current_section;
	char			buffer[16384];
	unsigned int 	vf_address;
	unsigned int 	buffer_size;
	unsigned int 	availableLength;
	AS3_Val 		decodedDataVal;
	AS3_Val			availableLengthVal;
	vf_as3_file		*audioData;

	/* initialize the AS3 values */
	decodedDataVal = AS3_Undefined();
	availableLengthVal = AS3_Undefined();

	/* pull out the arguments */
	AS3_ArrayValue(args, "IntType, IntType, AS3ValType",
					&vf_address, &buffer_size, &decodedDataVal);

	/* setup our pointer to the vorbisfile instance */
	vf_ptr = (OggVorbis_File *)vf_address;

	/* get the audio data */
	audioData = vf_ptr->datasource;

	/* get the amount of data we can actually read */
	availableLengthVal = AS3_GetS(audioData->dataVal, "length");
	availableLength = AS3_IntValue(availableLengthVal);

	total_bytes_read = 0;

	/* keep pulling out data and decoding until the requested buffer size is pulled */
	while (total_bytes_read < buffer_size) {
		/* decode some data */
		bytes_read = ov_read(vf_ptr, buffer, buffer_size, 0, 2, 1, &current_section);

		/* if we actually got some data, write it to our output */
		if (bytes_read > 0) {
			AS3_ByteArray_writeBytes(decodedDataVal, buffer, bytes_read);
		}
		total_bytes_read += bytes_read;

		/* break if we've run into the end of file or end of available data */
		if (bytes_read == 0 && (
			audioData->position == audioData->length ||
			audioData->position == availableLength)) {

				break;
		}
	}

	/* release the AS3 values */
	AS3_Release(decodedDataVal);
	AS3_Release(availableLengthVal);

	if (total_bytes_read == 0 && audioData->position == audioData->length) {
		return AS3_Int(-1);
	} else {
		return AS3_Int(total_bytes_read);
	}
}

/* Get the length (in seconds) of the file */
AS3_Val getLength(void *data, AS3_Val args)
{
	unsigned int	vf_address;
	double 			time;
	OggVorbis_File 	*vf_ptr;
	vf_as3_file		*audioData;

	/* pull out the arguments and get our instance of vorbisfile */
	AS3_ArrayValue(args, "IntType", &vf_address);
	vf_ptr = (OggVorbis_File *)vf_address;
	audioData = vf_ptr->datasource;

	/* fetch the length of the file */
	time = ov_time_total(vf_ptr, -1);

	return AS3_Number(audioData->totalTime);
}

/* Get the current position of the file (in seconds) */
AS3_Val getPosition(void *data, AS3_Val args)
{
	unsigned int 	vf_address;
	double 			time;
	OggVorbis_File 	*vf_ptr;

	/* pull out the arguments and get our instance of vorbisfile */
	AS3_ArrayValue(args, "IntType", &vf_address);
	vf_ptr = (OggVorbis_File *)vf_address;

	/* fetch the current time */
	time = ov_time_tell(vf_ptr);

	return AS3_Number(time);
}

/* Seek the audio to a given time (in seconds) */
AS3_Val seek(void *data, AS3_Val args)
{
	unsigned int 	vf_address;
	double 			time;
	int 			result;
	ogg_int64_t		originalPosition;
	unsigned int 	availableLength;
	OggVorbis_File 	*vf_ptr;
	AS3_Val			availableLengthVal;
	vf_as3_file		*audioData;

	/* pull out the arguments and get our instance of vorbisfile */
	AS3_ArrayValue(args, "IntType, NumberType", &vf_address, &time);
	vf_ptr = (OggVorbis_File *)vf_address;

	/* get the audioData */
	audioData = vf_ptr->datasource;

	/* get the available length */
	availableLengthVal = AS3_GetS(audioData->dataVal, "length");
	availableLength = AS3_IntValue(availableLengthVal);

	/* get the original position */
	originalPosition = ov_raw_tell(vf_ptr);

	/* seek to the new time */
	result = ov_time_seek(vf_ptr, time);

	/* see if we're past available data, if so, jump back and return false*/
	if (ov_raw_tell(vf_ptr) > availableLength) {
		ov_seek_raw(vf_ptr, originalPosition);

		return AS3_False();
	}

	/* return true since we seeked successfully */
	else {
		return AS3_True();
	}
}

/* Wrap up the thunks into AS3 functions and send back to ActionScript */
int main() {
	// setup vorbisfile
	AS3_Val versionVal = AS3_String("0.9.0");
	AS3_Val setupDecoderVal = AS3_Function(NULL, setupDecoder);
	AS3_Val getHeaderVal = AS3_Function(NULL, getHeader);
	AS3_Val getSampleDataVal = AS3_Function(NULL, getSampleData);
	AS3_Val getLengthVal = AS3_Function(NULL, getLength);
	AS3_Val getPositionVal = AS3_Function(NULL, getPosition);
	AS3_Val seekVal = AS3_Function(NULL, seek);

	// construct an object that holds refereces to the 2 functions
	AS3_Val result = AS3_Object("version:StrType", versionVal);
	AS3_SetS(result, "setupDecoder", setupDecoderVal);
	AS3_SetS(result, "getHeader", getHeaderVal);
	AS3_SetS(result, "getSampleData", getSampleDataVal);
	AS3_SetS(result, "getLength", getLengthVal);
	AS3_SetS(result, "getPosition", getPositionVal);
	AS3_SetS(result, "seek", seekVal);

	AS3_Release(setupDecoderVal);
	AS3_Release(getHeaderVal);
	AS3_Release(getSampleDataVal);
	AS3_Release(getLengthVal);
	AS3_Release(getPositionVal);
	AS3_Release(seekVal);

	// notify that we initialized -- THIS DOES NOT RETURN!
	AS3_LibInit(result);

	// XXX never get here!
	return 0;
}

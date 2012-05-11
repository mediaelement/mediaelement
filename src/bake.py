#!/usr/bin/env python


import sys, os, shutil
import cProfile
from Queue import Queue
from threading import Thread



class Worker(Thread):
    """
        Thread executing tasks from a given tasks queue
    """
    def __init__(self, tasks):
        Thread.__init__(self)
        self.tasks = tasks
        self.daemon = True
        self.start()
    
    def run(self):
        while True:
            func, args, kargs = self.tasks.get()
            try: func(*args, **kargs)
            except Exception, e: print(e)
            self.tasks.task_done()



class ThreadPool:
    """
        Pool of threads consuming tasks from a queue
    """
    def __init__(self, num_threads):
        """
            Queue(0) should possible avoid deadlocks 
        """
        self.tasks = Queue(num_threads)
        for _ in range(num_threads): Worker(self.tasks)

    def add_task(self, func, *args, **kargs):
        """
            Add a task to the queue
        """
        self.tasks.put((func, args, kargs))

    def wait_completion(self):
        """
            Wait for completion of all the tasks in the queue
        """
        self.tasks.join()




def putFiles(files, destination, message = None):
    """
        combine files into a single one, called destination    
    """
    if message is not None:
        print(message)

    with open(destination, 'w') as dest:
        for source in files:
            with open(source, 'r') as src:
                dest.write(src.read())
                dest.write('\n')



def jarCompress(src, out, message = None):
    """
        MINIFY files using the amazing compiler.jar
    """
    if message is not None:
        print(message)

    # java -jar PATHTO_JAR INPUT_FILE -o OUTPUT_FILE
    execute = '%s %s -o %s' % ('java -jar yuicompressor-2.4.2.jar', src, out)
    # exec command
    os.system(execute)



def addHeader(headerFilename, filename, message = None):
    """
        append contents to a file
    """

    if message is not None:
        print(message)

    # get the header text
    with open(headerFilename) as tmp_file:
        header_txt = tmp_file.read()

    # read the current contents of the file
    with open(filename) as tmp_file:
        file_txt = tmp_file.read()
    
    # open the file again for writing
    with open(filename, 'w') as tmp_file:
        # write the header text
        tmp_file.write(header_txt)
        # write the original contents
        tmp_file.write(file_txt)





def main():

    """
    
        - bake -
    
    
        for faster minify and lesser work
    
        @author Tim Latz (latz.tim@gmail.com)
        @date   26.11.2011 (date of creation)
        
        note: pathes are project related

        moving this script will cause errors.

        default location: ~src/
        default target location: ~../build/

        ------------------------------------

        bakeflow:
            1) copy (mostly binary) files into the build folder
            2) summarize and minify me and mep into single files
            3) brand mediaelement and mediaelementplayer
            4) process css files


        @modified: 11.05.2012 (split bakeflow into three tasks)

    """

    BAKE_VERSION = '0.5'


    def taskCopyBinaries():

        # 1)
        binaries = (
            ('css/bigplay.png', '../build/bigplay.png'),
            ('css/loading.gif', '../build/loading.gif'),
            ('css/mejs-skins.css', '../build/mejs-skins.css'),
            ('css/controls-ted.png', '../build/controls-ted.png'),
            ('css/controls-wmp.png', '../build/controls-wmp.png'),
            ('css/controls-wmp-bg.png', '../build/controls-wmp-bg.png'),
            ('css/controls.png', '../build/controls.png'),
            
        )
        
        [shutil.copy2(src, dest) for src, dest in binaries]



    def taskMinifyJavascript():
        
        # 2)
        me_filename       = 'mediaelement'
        mep_filename      = 'mediaelementplayer'
        combined_filename = 'mediaelement-and-player'
    
    
        me_file  = '%s%s%s' % ('../build/', me_filename, '.js')
        mep_file = '%s%s%s' % ('../build/', mep_filename, '.js')
        combined_file = '%s%s%s' % ('../build/', combined_filename, '.js')
    
    
        both_files = []
        both_files.append(me_file)
        both_files.append(mep_file)
    
    
        me_files = []
        me_files.append('js/me-header.js')
        me_files.append('js/me-namespace.js')
        me_files.append('js/me-utility.js')
        me_files.append('js/me-plugindetector.js')
        me_files.append('js/me-featuredetection.js')
        me_files.append('js/me-mediaelements.js')
        me_files.append('js/me-shim.js')
    
    
        mep_files = []
        mep_files.append('js/mep-header.js')
        mep_files.append('js/mep-library.js')
        mep_files.append('js/mep-player.js')
        mep_files.append('js/mep-jquery.js')
        mep_files.append('js/mep-feature-playpause.js')
        mep_files.append('js/mep-feature-stop.js')
        mep_files.append('js/mep-feature-progress.js')
        mep_files.append('js/mep-feature-time.js')
        mep_files.append('js/mep-feature-volume.js')
        mep_files.append('js/mep-feature-fullscreen.js')
        mep_files.append('js/mep-feature-tracks.js')
        mep_files.append('js/mep-feature-contextmenu.js')

        # build mediaelement
        putFiles(me_files, me_file, '\tbuild ' + me_filename)
    
        # build mediaelementplayer 
        putFiles(mep_files, mep_file, '\tbuild ' + mep_filename)
        
        # put both into a single one 
        putFiles(both_files, combined_file, '\tbuild ' + combined_filename)
    
        # minify mediaelement + player (but belongs to bakeflow 3)
        jarCompress(me_file, '../build/' + me_filename + '.min.js')
        jarCompress(mep_file, '../build/' + mep_filename + '.min.js')
        jarCompress(combined_file, '../build/' + combined_filename + '.min.js')

        # 3)
        # add copyright
        # It's faster running the header through the compiler 
        # due python lacks in speed of file appending! [tl] 
        #addHeader('js/me-header.js', me_file)
        #addHeader('js/mep-header.js', mep_file)

   
    

    def taskMinifyCss():
        # 4)
        # minify the mep stylesheet
        putFiles(['css/mediaelementplayer.css'], '../build/mediaelementplayer.css')
        jarCompress('../build/mediaelementplayer.css', '../build/mediaelementplayer.min.css')





    print('Bake v'+BAKE_VERSION+' (mediaelement in the oven)')

    # init a new thread pool 
    pool = ThreadPool(3)
    # assign tasks to workers
    pool.add_task(taskCopyBinaries)
    pool.add_task(taskMinifyJavascript)
    pool.add_task(taskMinifyCss)
    # let workers do the tasks
    pool.wait_completion()

    
    print('Done. Thank you for your patient.')


    # return exit code 0
    return 0 







if __name__ == '__main__':

    BAKE_MAGIC = '--debug'
    BAKE_DEBUG = False
    BAKE_EXIT  = 0 


    try: 
        BAKE_DEBUG = sys.argv[1]
    except IndexError: 
        BAKE_DEBUG = False
    finally:
        if BAKE_DEBUG == BAKE_MAGIC:
            print('* DEBUG MODE *')
            cProfile.run('main()')
        else:
            BAKE_EXIT = main()

        sys.exit(BAKE_EXIT)

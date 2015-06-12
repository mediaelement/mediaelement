describe("mejs.Utility", function() {

	it("mejs.Utility.calculateTimeFormat", function() {
		var options = {};
		options.timeFormat = 'mm:ss';

		mejs.Utility.calculateTimeFormat(0, options);
		expect(options.currentTimeFormat).toEqual('mm:ss');

		options.timeFormat = 'm:ss';
		mejs.Utility.calculateTimeFormat(30, options);
		expect(options.currentTimeFormat).toEqual('m:ss');

		options.timeFormat = 's';
		mejs.Utility.calculateTimeFormat(30, options);
		expect(options.currentTimeFormat).toEqual('s');

		options.timeFormat = 's';
		mejs.Utility.calculateTimeFormat(60, options);
		expect(options.currentTimeFormat).toEqual('m:ss');

		options.timeFormat = 'f';
		mejs.Utility.calculateTimeFormat(61, options);
		expect(options.currentTimeFormat).toEqual('m:ss:ff');

		options.timeFormat = 'f';
		mejs.Utility.calculateTimeFormat(3600, options);
		expect(options.currentTimeFormat).toEqual('h:mm:ss:ff');

		options.timeFormat = 'ff';
		mejs.Utility.calculateTimeFormat(3600, options);
		expect(options.currentTimeFormat).toEqual('hh:mm:ss:ff');
	});

	it("mejs.Utility.secondsToTimeCode", function() {
		var options = {};

		options.currentTimeFormat = 'mm:ss';
		var res = mejs.Utility.secondsToTimeCode(0, options);
		expect(res).toEqual('00:00');

		options.currentTimeFormat = 'm:ss';
		res = mejs.Utility.secondsToTimeCode(30, options);
		expect(res).toEqual('0:30');

		options.currentTimeFormat = 'mm:ss';
		res = mejs.Utility.secondsToTimeCode(30, options);
		expect(res).toEqual('00:30');

		options.currentTimeFormat = 'mm:ss';
		res = mejs.Utility.secondsToTimeCode(3601, options);
		expect(res).toEqual('00:01');

		options.currentTimeFormat = 'h:mm:ss';
		res = mejs.Utility.secondsToTimeCode(3601, options);
		expect(res).toEqual('1:00:01');
	});
});

describe("mejs.Utility", function() {
	it("mejs.Utility.secondsToTimeCode", function() {
		var res = mejs.Utility.secondsToTimeCode(0);
		expect(res).toEqual('00:00');

		res = mejs.Utility.secondsToTimeCode(30);
		expect(res).toEqual('00:30');

		res = mejs.Utility.secondsToTimeCode(60);
		expect(res).toEqual('01:00');

		res = mejs.Utility.secondsToTimeCode(61);
		expect(res).toEqual('01:01');

		res = mejs.Utility.secondsToTimeCode(61, true);
		expect(res).toEqual('00:01:01');

		res = mejs.Utility.secondsToTimeCode(61, true, true);
		expect(res).toEqual('00:01:01:00');

		res = mejs.Utility.secondsToTimeCode(61, false, true);
		expect(res).toEqual('01:01:00');


		res = mejs.Utility.secondsToTimeCode(3600);
		expect(res).toEqual('01:00:00');

		res = mejs.Utility.secondsToTimeCode(3601);
		expect(res).toEqual('01:00:01');
	});
});

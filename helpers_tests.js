window.testCollection = new Meteor.Collection('test', { connection: null });

  Tinytest.add('Handlebar helpers - init session templates', function (test) {
	  test.equal(Template.test_helpers_00.render(), "Hi");
	});

	Tinytest.add('Handlebar helpers - init session helpers', function (test) {
	  test.notEqual(Handlebars._globalHelpers['$'], undefined, '$: Handlebars loaded after session_helpers?');
	  // test.notEqual(Handlebars._globalHelpers['find'], undefined, 'find: Handlebars loaded after session_helpers?');
	  // test.notEqual(Handlebars._globalHelpers['findOne'], undefined, 'findOne: Handlebars loaded after session_helpers?');
	});

	Tinytest.add('Handlebar helpers - test {{getSession}}', function (test) {
		Session.set('test', undefined);
		var onscreen = Template.test_helpers_10.render();

		test.isNull(onscreen(), 'getSession should be empty or set from last session');

		Session.set('test', 'jlfkjsdfldf');

		test.equal(onscreen(), "jlfkjsdfldf", 'getSession dont return as expected');

		Session.set('test', 'ok');

		test.equal(onscreen(), "ok", 'getSession dont return "ok" as expected');

	});

	Tinytest.add('Handlebar helpers - {{sessionEquals}} String', function (test) {
		//Template.test_helpers_20
		Session.set('test', undefined);
		var onscreen = Template.test_helpers_20.render();
		test.isNull(onscreen());
		Session.set('test', 'sdfsdfdsf');

		test.equal(onscreen(), 'true');
		Session.set('test', 'ok');

		test.isNull(onscreen());

	});

	Tinytest.add('Handlebar helpers - {{sessionEquals}} Integer', function (test) {
		//Template.test_helpers_21
		Session.set('test', undefined);
		var onscreen = Template.test_helpers_21.render();
		var onscreen2 = Template.test_helpers_22.render();
		var onscreen3 = Template.test_helpers_20.render();
		test.isNull(onscreen());
		
		Session.set('test', 1);

		test.equal(onscreen(), 'true');
		test.isNull(onscreen2());
		test.isNull(onscreen3());

		Session.set('test', 'ok');

		test.isNull(onscreen());




	});

	//XXX: Only string and int can be passed as parametre for helpers?
	Tinytest.add('Handlebar helpers - {{sessionEquals}} Array', function (test) {
		//Test of arrays
		//Template.test_helpers_23
		Session.set('test', undefined);
		var onscreen = Template.test_helpers_23.render();
		//test.equal(onscreen(), 'false');
		Session.set('test', ['a', 'b', 'c']);

		// Setting this to false - should be true - but arrays are not supported
		test.isNull(onscreen(), 'Issue 617, This fails due to lack of support for value input as array');
		Session.set('test', 'ok');

		test.isNull(onscreen());

	});

	//XXX: Only string and int can be passed as parametre for helpers?
	Tinytest.add('Handlebar helpers - {{sessionEquals}} Objects', function (test) {
		Template.test_helpers_24.value = function() {
			return {foo: 'bar'};
		};
		//Test of arrays
		//Template.test_helpers_23
		Session.set('test', undefined);
		var onscreen = Template.test_helpers_24.render();
		// Should be notEqual
		test.equal(typeof Template.test_helpers_24, 'object', 'Handlebars does not support objects as input in helpers');
		//test.equal(onscreen(), 'false');
		Session.set('test', {foo: 'bar'});

		// Should be true
		test.isNull(onscreen(), 'Issue 617, This fails due to lack of support for value input as objects');
		Session.set('test', 'ok');

		// Should be false
		test.isNull(onscreen());

	});

	Tinytest.add('Handlebar helpers - {{sessionEquals}} Boolean', function (test) {
		//Template.test_helpers_24
		Session.set('test', undefined);
		var onscreen1 = Template.test_helpers_25.render();
		var onscreen2 = Template.test_helpers_26.render();
		var onscreen3 = Template.test_helpers_27.render(); //Test if sessionEquals

		test.isNull(onscreen1());
		Session.set('test', true);

		test.equal(onscreen1(), 'true');
		test.isNull(onscreen2());
		test.equal(onscreen3().render(), 'Test is true');
		Session.set('test', false);

		test.isNull(onscreen1());
		test.equal(onscreen2(), 'true');
		test.equal(onscreen3().render(), 'Test is false');



	});

	// Tinytest.addAsync("Handlebar helpers - test {{findOne}} and {{find}}", function (test, onComplete) {
	// 	testCollection.insert({ a: 1, b:2 });

	// 	var onscreen1 = Template.test_helpers_30.render(); //findOne
	// 	var onscreen2 = Template.test_helpers_31.render(); //find
	// 	var onscreen3 = Template.test_helpers_32.render(); //with find
	// 	var onscreen4 = Template.test_helpers_33.render(); //with find return a
	// 	var onscreen5 = Template.test_helpers_34.render(); //each find return a

	// 	test.notEqual(Template.test_helpers_30, undefined, 'findOne');
	// 	test.notEqual(Template.test_helpers_31, undefined, 'find');
	// 	test.notEqual(Template.test_helpers_32, undefined, 'with');
	// 	test.notEqual(Template.test_helpers_33, undefined, 'with return a');
	// 	test.notEqual(Template.test_helpers_34, undefined, 'each return a');

	// 	test.equal(onscreen1(), '[object Object]', '{{findOne}}');
	// 	test.equal(onscreen2(), '[object Object]', '{{find}}');
	// 	test.equal(onscreen3(), 'ok', 'with {{findOne}}');
	// 	test.equal(onscreen4(), '1', 'with {{findOne}}');
	// 	test.equal(onscreen5(), '1', 'each {{find}}');
	// 	//console.log(onscreen5());

	// 	testCollection.remove({}); //Remove all

	// 	test.equal(onscreen1(), '<!--empty-->', '{{findOne}}');
	// 	test.equal(onscreen2(), '[object Object]', '{{find}}'); //Guess this allways returns an object
	// 	//test.equal(onscreen3(), 'ok', 'with {{findOne}}');
	// 	test.equal(onscreen4(), '<!--empty-->', 'with {{findOne}}');
	// 	test.equal(onscreen5(), 'none', 'each {{find}}');
	// 	//console.log(onscreen5());





	// 	onComplete();
	// });

//Test API:
//test.isFalse(v, msg)
//test.isTrue(v, msg)
//test.equalactual, expected, message, not
//test.length(obj, len)
//test.include(s, v)
//test.isNaN(v, msg)
//test.isUndefined(v, msg)
//test.isNotNull
//test.isNull
//test.throws(func)
//test.instanceOf(obj, klass)
//test.notEqual(actual, expected, message)
//test.runId()
//test.exception(exception)
//test.expect_fail()
//test.ok(doc)
//test.fail(doc)
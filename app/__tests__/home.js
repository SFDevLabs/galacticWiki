// {YourPath}/Example-test.js
jest.dontMock('object-assign');
jest.dontMock('../frontend/components/Home.react.js');
jest.dontMock('../frontend/stores/Store.js');
jest.dontMock('./ReactRouterContext.js');

describe('Example', function() {
  var React              = require('react/addons');
  var YourComponent      = require('../frontend/components/Home.react.js');
  var TestUtils          = React.addons.TestUtils;
  var ReactRouterContext = require('./ReactRouterContext.js');
  var yourComponent;

  // This is needed to stop the test from complaining about the Link element from react-router
  YourComponent = ReactRouterContext(YourComponent, {});

  beforeEach(function() {
    yourComponent = TestUtils.renderIntoDocument(
      // Notice that you don't pass your props here. They were passed above.
      <YourComponent />
    );
  });

  it('nav Renders', function() {
	 var navs = TestUtils.scryRenderedDOMComponentsWithTag(yourComponent, 'Input');
     expect(navs.length).toEqual(1);
  });

});
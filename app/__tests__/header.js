// {YourPath}/Example-test.js
jest.dontMock('object-assign');
jest.dontMock('../frontend/components/Header.react.js');
jest.dontMock('./ReactRouterContext.js');

describe('Example', function() {
  var React              = require('react/addons');
  var YourComponent      = require('../frontend/components/Header.react.js');
  var TestUtils          = React.addons.TestUtils;
  var ReactRouterContext = require('./ReactRouterContext.js');
  var yourComponent;

  // This is needed to stop the test from complaining about the Link element from react-router
  YourComponent = ReactRouterContext(YourComponent, {someProp: 'foo' });

  beforeEach(function() {
    yourComponent = TestUtils.renderIntoDocument(
      // Notice that you don't pass your props here. They were passed above.
      <YourComponent />
    );
  });

  it('nav Renders', function() {
	 var navs = TestUtils.scryRenderedDOMComponentsWithTag(yourComponent, 'nav');
     expect(navs.length).toEqual(1);
  });

  it('nav click makes with a UL list', function() {
	 var navBar = TestUtils.scryRenderedDOMComponentsWithTag(yourComponent, 'ul');
     expect(navBar.length).toEqual(1);
  });

});
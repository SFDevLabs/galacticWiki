/** @jsx React.DOM */
jest.dontMock('../frontend/components/App.react.js');
var React = require('react/addons');
var Home = require('../frontend/components/Home.react.js');
var TestUtils = React.addons.TestUtils;

// describe('task text', function() {
//   it('the task text is accurate', function() {
//     var index = 0;
//     var task = <Task name="hi" index={index} />;
//     var DOM = TestUtils.renderIntoDocument(task);
//     var span = DOM.refs.text;
//     expect(span.getDOMNode().textContent).toEqual('1: hi');
//  });


// });

// describe('task when clicked fires on destroy event', function() {
//   it('test', function() {
//     // var testing = false;
//     // var testingFunction = function() {
//     //   testing = true;
//     // };
//     // var task = <Home />;
//     // var DOM = TestUtils.renderIntoDocument(task);
//     // // var input = DOM.refs.completeButton
//     // // React.addons.TestUtils.Simulate.click(input.getDOMNode());
//     // expect(testing).toBe(true);
//   });
// });
# How to install and run
  1. Extract zip in a folder
  2. run yarn install
  3. npm start

# Development Note
   1. Used create-react-app for boilerplate
   1. Browser tested on Chrome and Firefox only due to a problem of Edge on development machine :(
   2. Used observer pattern for components communication.  
      (Other common patterns like using parent component, flux/redux or context would be considered.)

# Features implemented
 * Customizable grid : size, width and height by passing props
 * Responds back to the user if 
    1. Robot (Vader) collects treasures (R2D2)
    2. User enter a wrong command
    3. User drive the robot in wrong direction
 
 # Things needs to be done for improvement ( but not in this version ) 
 * Responsive grid and layout 
 * Unit testing
 * Some components/models bloated. It requires refactoring. They can be split into multiple smaller ones
 * Use of React Hooks 
 * Complete seprate of UI and data layer. 
 * Use of eslint/proptypes
 * More detailed comments

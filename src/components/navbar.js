import React from "react";
import { NavLink } from "react-router-dom";
import { Popover, Position } from "@blueprintjs/core";
import "./App.css";

export default function Navigation() {
  return (
    <div className='navbar'>
      <h3>Interactive Visualization for AI Education </h3>
      <NavLink exact to='/' className='link'>
        home
      </NavLink>
      <NavLink to='/about' className='link'>
        about
      </NavLink>
      <Popover
        content={
          <div className='popoverContent'>
            <NavLink to='/chapter0' className='popLink'>
              Chapter 0 - Introduction
            </NavLink>
            <NavLink to='/chapter1' className='popLink'>
              Chapter 1 - Multi-categorical Classification - Logistic Regression
            </NavLink>
            <NavLink to='/chapter2' className='popLink'>
              Chapter 2 - Multi-categorical Classification - Neural Networks
            </NavLink>
            <NavLink to='/chapter3' className='popLink'>
              Chapter 3 - Image Classification - Neural Networks
            </NavLink>
            <NavLink to='/chapter4' className='popLink'>
              Chapter 4 - Image Classification with Convolutional Neural
              Networks
            </NavLink>
            <NavLink to='/chapter5' className='popLink'>
              Chapter 5 - Sentiment Classification with Neural Networks
            </NavLink>
          </div>
        }
        className='link'
        position={Position.BOTTOM_RIGHT}>
        learn
      </Popover>
    </div>
  );
}

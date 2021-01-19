import React from 'react'
import './index.css'

const CustomToolbar = () => (
  <div id='toolbar'>
    <select className='ql-font tool-element' defaultValue='arial'>
      <option value='arial'>
        Arial
      </option>
      <option value='comic-sans'>Comic Sans</option>
      <option value='courier-new'>Courier New</option>
      <option value='georgia'>Georgia</option>
      <option value='helvetica'>Helvetica</option>
      <option value='lucida'>Lucida</option>
    </select>
    <select className='ql-align tool-element' type='button' />
    <button className='ql-bold tool-element' type='button' />
    <button className='ql-italic tool-element' type='button' />
    <button className='ql-underline tool-element' type='button' />
    <button className='ql-strike tool-element' type='button' />
    <button className='ql-blockquote tool-element' type='button' />
    <select className='ql-size tool-element' defaultValue='extra-small'>
      <option value='extra-small'>Extra small</option>
      <option value='small'>Small</option>
      <option value='medium'>
        Medium
      </option>
      <option value='large'>Large</option>
    </select>
    <select className='ql-color tool-element' />
    <select className='ql-background tool-element' />
    <button className='ql-list tool-element' value='ordered' type='button' />
    <button className='ql-list tool-element' value='bullet' type='button' />
    <button className='ql-clean tool-element' type='button' />
    <button className='ql-link tool-element' type='button' />
    <button className='ql-image tool-element' type='button' />
  </div>
)

export default CustomToolbar
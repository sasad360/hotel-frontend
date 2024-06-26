import React from 'react';
import NotFound from '../Images/error404.jpg';
import { Link } from 'react-router-dom';

const Not404 = () => {
  return (
    <div className='containerfull'>
        <div className="not-found">
            <img src={NotFound} className='notfoundImg'/>
            <h1>Oops! We can't find the page <br/>you're looking for.</h1>
            <p>The URL you entered may be incorrect, or the page may no longer exist. go to <Link to="/">home Page</Link> or</p>
            
            <button onClick={() => window.history.back()}>Go Back</button>
        </div>
    </div>
  )
}

export default Not404
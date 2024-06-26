import React, { useEffect } from 'react';
import axiosClient from '../axios-client'; 
import Swal from 'sweetalert2'; // import SweetAlert

const Logout = () => {
    const logoutfun = () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
    
        if (!token) {
            // If no token found in local storage, simply redirect to login page
            window.location.href = '/login';
            return;
        }
    
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then(async (result) => {
            if (result.isConfirmed) {
                axiosClient.post('/logout', { token })
                    .then((response) => {
                        const { success, message } = response.data;
                        if (success) {
                            // Remove token from local storage if logout is successful
                            localStorage.removeItem('ACCESS_TOKEN');
                            // Redirect to the login page or any other page after logout
                            window.location.href = '/login';
                        } else {
                            // Show error message if logout fails
                            Swal.fire({
                                title: 'Logout Failed',
                                text: message || 'Failed to logout. Please try again.',
                                icon: 'error',
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Logout failed:', error);
                        // Show error message if logout request fails
                        Swal.fire({
                            title: 'Logout Failed',
                            text: 'Failed to logout. Please try again.',
                            icon: 'error',
                        });
                    });
            }
        });
    }
    
    useEffect(() => {
     logoutfun();
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    // Render an empty <div> or null because the logout action is handled in the useEffect hook
    return null;
};

export default Logout;

import React,{useState, useEffect} from 'react';
import SilviewImg from '../Images/visioninn.png';
// import AdminImg from '../Images/admin.jpg';
import { Link, NavLink } from 'react-router-dom';
import axiosClient from '../axios-client';


const Sidebar = () => {

    const[userInfo, setUserInfo] = useState([null]);

    const [submenuVisible, setSubmenuVisible] = useState([false]);

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleSubmenu = (event) => {
    const parentMenu = event.target.closest(".menu");
    const subMenu = parentMenu.nextElementSibling;
    const allSubMenus = document.querySelectorAll(".submenu");

  
    allSubMenus.forEach((menu) => {
      if (menu !== subMenu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        menu.style.display = "none";
        menu.previousElementSibling.classList.remove("active");
      }
    });
  
    if (subMenu.style.display === "none") {
      allSubMenus.forEach((menu) => {
        menu.style.display = "none";
        menu.previousElementSibling.classList.remove("active");
      });
      subMenu.style.display = "block";
      parentMenu.classList.add("active");
    } else {
      subMenu.style.display = "none";
      parentMenu.classList.remove("active");
    }
    };

    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
      });
    
      const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
      };
    
      useEffect(() => {
        if (isDarkTheme) {
          document.body.classList.add('dark-theme-variables');
        } else {
          document.body.classList.remove('dark-theme-variables');
        }
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
      }, [isDarkTheme]);
  
      const toggleSideMenu = () => {
        setIsSidebarVisible(!isSidebarVisible);
      };

    
      useEffect(() => {
        axiosClient.get('/user')
            .then((response) => {
                // Update the state with the user data
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
     }, []);
    

  
  
  

  return (
    <>
      <div className={`asidecontainer ${isSidebarVisible ? 'visible' : 'hidden'}`}>
        <aside>
              <div className="top">
                  <div className="logo">
                      <img src={SilviewImg} alt="logo"/>
                  </div>
                  <div className="close" id="close-btn" onClick={toggleSideMenu}>
                      <span className="material-symbols-outlined">close</span>
                  </div>
              </div>
              <div className="sidebar">

                  <div className="menu">
                      <h3>
                          <Link to='/'>
                              <span className="material-symbols-outlined">dashboard</span>
                              Dashboard
                          </Link>
                      </h3>
                  </div>

                  <div className="menu" onClick={toggleSubmenu}>
                      <a>
                          <span className="material-symbols-outlined">note_add</span>
                          <h3>Feed Data</h3>
                      </a>
                  </div>
                  <div className="submenu">
                      <li><NavLink to="newroom">Add New Room</NavLink></li>
                      <li><NavLink to="newemployee">Add New Employee</NavLink></li>
                      <li><NavLink to="newposition">New Position</NavLink></li>
                      <li><NavLink to="newdepartment">New Department</NavLink></li>
                      <li><NavLink to="newinventory">Inventory</NavLink></li>
                      <li><NavLink to="expense">Expense</NavLink></li>
                      <li><NavLink to="expensehead">Expense Head</NavLink></li>
                  </div>

                  <div className="menu" onClick={toggleSubmenu}>
                      <a>
                          <span className="material-symbols-outlined">person_add</span>
                          <h3>Booking</h3>
                      </a>
                  </div>
                  <div className="submenu">
                      <li><NavLink to="customerlist">New Cusomter</NavLink></li>
                      <li><NavLink to="bookinglist">New Booking</NavLink></li>
                      <li><NavLink to="servicetocheckin">Service to Cusomter</NavLink></li>
                      <li><NavLink to="customercheckout">Check-Out</NavLink></li>
                      {/* <li><NavLink to="allotfile">Allotment of File</NavLink></li>
                      <li><NavLink to="filetransfer">File Transfer</NavLink></li> */}
                  </div>

                  <div className="menu" onClick={toggleSubmenu}>
                      <a>
                          <span className="material-symbols-outlined">account_balance_wallet</span>
                          <h3>Accounts</h3>
                      </a>
                  </div>
                  <div className="submenu">
                      <li><NavLink to="salarypayment">Salary Payment</NavLink></li>
                      <li><NavLink to="paymentrecord">Payment Record</NavLink></li>
                      {/* <li><NavLink to="cashbook">Cash Book</NavLink></li> */}
                  </div>

                  {/* <div className="menu" onClick={toggleSubmenu}>
                      <NavLink to="/print">
                          <span className="material-symbols-outlined">print</span>
                          <h3>Prints</h3>
                      </NavLink>

                  </div>
                  <div className="submenu">
                      <li><NavLink>Bills</NavLink></li>
                      <li><NavLink>Inventory</NavLink></li>
                      <li><NavLink>Monthly Balance Sheet</NavLink></li>
                  </div> */}

                  <div className="menu" onClick={toggleSubmenu}>
                      <a>
                          <span className="material-symbols-outlined">restaurant</span>
                          <h3>Restaurant</h3>
                      </a>
                  </div>
                  <div className="submenu">
                      <li><NavLink to="dinning_bill">New Dinning Bill</NavLink></li>
                      <li><NavLink to="all_bills">All Bills</NavLink></li>
                  </div>

                  <div className="menu" onClick={toggleSubmenu}>
                      <a>
                          <span className="material-symbols-outlined">menu_book</span>
                          <h3>Food Menu</h3>
                      </a>

                  </div>
                  <div className="submenu">
                      <li><NavLink to="menuitems">Menu Items</NavLink></li>
                      <li><NavLink to="weeklymenu">Weekly Menu</NavLink></li>
                  </div>

                  <div className="menu" onClick={toggleSubmenu}>
                      <a>
                          <span className="material-symbols-outlined">query_stats</span>
                          <h3>Repots</h3>
                      </a>

                  </div>
                  <div className="submenu">
                      <li><NavLink to="dailyrestaurant">Restaurant Reports</NavLink></li>
                      <li><NavLink to="dailyhotel">Hotel Reports</NavLink></li>
                  </div>


                  {/* <div className="menu" onClick={toggleSubmenu}>
                      <Link to="#">
                          <span className="material-symbols-outlined">outgoing_mail</span>
                          <h3>Letter/Notices</h3>
                      </Link>
                  </div>
                  <div className="submenu">
                      <li><NavLink>General Letters</NavLink></li>
                      <li><NavLink>Notice/Default Letters</NavLink></li>
                      <li><NavLink>Cash Sold plots</NavLink></li>
                      <li><NavLink>Commission paid</NavLink></li>
                  </div> */}

                  <div className="menu" onClick={toggleSubmenu}>
                      <Link to="#">
                          <span className="material-symbols-outlined">settings</span>
                          <h3>Settings</h3>
                      </Link>

                  </div>
                  <div className="submenu">
                      <li><NavLink to="newuser">Users Settings</NavLink></li>
                      <li><NavLink to="userupdate">Update Account</NavLink></li>
                      <li><NavLink to="software">About Software</NavLink></li>
                  </div>

                  <div className="menu" >
                      <NavLink to="logout">
                          <span className="material-symbols-outlined">logout</span>
                          <h3>Logout</h3>
                      </NavLink>
                  </div>
              </div>
        </aside>
      </div>
      
      <div className="right dashuser">
        {/* <div>
          <input type="checkbox" id="menu"/>
          <label for="menu" className="icon">
                  <div className="menu" onClick={toggleSubmenu}></div>
          </label>
        </div> */}
        
        <div className="top topnav">
            <button id="menu-btn" >
                <span onClick={toggleSideMenu} className="material-symbols-outlined">menu</span>
            </button>
            <div className="theme-toggler" onClick={toggleTheme}>
                <span id="light-theme" className={`material-symbols-outlined ${!isDarkTheme ? 'active' : ''}`}>
                light_mode
                </span>
                <span id="dark-theme" className={`material-symbols-outlined ${isDarkTheme ? 'active' : ''}`}>
                dark_mode
                </span>
            </div>
            <div className="profileDash">
                <div className="info">
                    <p>hey, <b>{userInfo ?
                    <p>{userInfo.name}</p>
                    :
                    <div>Tanveer Ahmed</div>
                    }</b></p>
                    {userInfo.type?
                    <small className="text-muted">{userInfo.type}</small>
                    :
                    <small className="text-muted">User</small>
                    }
                </div>
                <div className="profile-photo">
                    {userInfo && userInfo.name ?
                        <div className="profile-circle">
                            {userInfo.name.charAt(0)}
                        </div>
                        :
                        <div className="profile-circle">
                            B {/* Default value when userInfo or name is undefined */}
                        </div>
                    }
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
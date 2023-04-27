import myLogo from './assets/HS.svg'
import LinkedIn from './assets/LinkedIn.svg'
import LinkedInLight from './assets/LinkedInLight.svg'
import { BrowserRouter as Router, Route, Routes,NavLink } from 'react-router-dom';


const HomePage:React.FC = () => {
  
    return (
      <div className="HomePage">
        <header className="HomePahe-header">
        <NavLink to="/">
            <img src={myLogo} className="logo" alt="my logo" />
        </NavLink>

        <div className="one-rent-container">
            <NavLink to="/one-rent-tool">
                <button className="one-rent-button">One Rent Tool</button>
            </NavLink>
        </div>
        </header>
        </div>
    );
    };
    export default HomePage;

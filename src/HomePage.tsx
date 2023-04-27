import myLogo from './assets/HS.svg'
import LinkedIn from './assets/LinkedIn.svg'
import LinkedInLight from './assets/LinkedInLight.svg'
import { BrowserRouter as Router, Route, Routes,NavLink } from 'react-router-dom';
interface HomePageToolProps {
    theme: string;
  }

const HomePage:React.FC<HomePageToolProps> = ({ theme }) => {
  
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
        <div className="linked-logo-container">
        <a href="https://www.linkedin.com/in/samuel-huppert/" target = "_blank" rel="noopener noreferrer">
        <img src={theme === 'light' ? LinkedInLight : LinkedIn} className="linkedlogo" alt="my logo" />
        </a>
        </div>
        </header>
        </div>
    );
    };
    export default HomePage;

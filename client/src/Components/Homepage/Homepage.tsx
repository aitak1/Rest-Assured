import React, { useState } from "react";
import "./Homepage.css"; // Import your CSS file here
import restroomSign from "./restroomsign.jpg"; // Make sure this path is correct
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Make sure i18next is initialized in your project
import LanguageSelector from "../../Translations/language-selector"; // Adjust the path as needed

function Homepage() {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    navigate(`/dashboard?address=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchByLocation = () => {
    navigate("/dashboard?useLocation=true");
  };

  const handleAddRestroom = () => {
    // Implementation needed
    navigate("/add-restroom");
  };

  return (
    <div className="page">
      <LanguageSelector />
      <div className="welcome-container">
        <h1>{t("global.landing.title")}</h1>
        <h1>{t("global.landing.description")}</h1>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder={t("global.landing.searchbar")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button onClick={handleSearchByLocation} className="location-button">
            <FontAwesomeIcon icon={faCrosshairs} />
          </button>
        </div>
        <button onClick={handleAddRestroom} className="add-restroom-button">
          {t("global.landing.addrestroom")}
        </button>
        <div className="image-container">
          <img
            src={restroomSign}
            alt={t("global.restroomSignAlt")} // The key might need to be updated according to your JSON file
            className="restroom-image"
          />
        </div>
      </div>
      <footer className="footer">Made with ❤️ by Team Hex</footer>
    </div>
  );
}

export default Homepage;
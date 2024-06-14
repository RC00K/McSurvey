import { IonIcon } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import "./NavToolbar.css";

const NavToolbar = () => {
    return (
        <header>
            <nav className="navigation__group">
                <button type="button" className="navigation__button">
                    <IonIcon icon={chevronBack} />
                </button>
            </nav>
        </header>
    );
};

export default NavToolbar;
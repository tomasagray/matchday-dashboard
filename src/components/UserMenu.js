import React, {Component} from 'react';

class UserMenu extends Component {
    constructor(props) {
        super(props);

        // event handlers
        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.state = {
            showMenu: false,
        }
    }

    showMenu(event) {
        event.preventDefault();

        this.setState({showMenu: true}, () => {
            document.addEventListener('click', this.closeMenu);
        })
    }

    closeMenu(event) {
        if (!this.dropdownMenu.contains(event.target)) {
            this.setState({showMenu: false}, () => {
                document.removeEventListener('click', this.closeMenu);
            });
        }
    }

    render() {
        return (
            <div className="User-menu-button-wrapper" id="User-menu-button-wrapper" ref={(element) => {
                this.dropdownMenu = element;
            }}>
                <button onClick={this.showMenu} className="Nav-link">
                    <img src={process.env.PUBLIC_URL + 'img/avatar-icon.png'} alt="User menu"/>
                </button>
                {
                    this.state.showMenu ? (
                        <div className="User-menu-wrapper">
                            <ul className="User-menu">
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                            </ul>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default UserMenu;

import {
    Search,
    Bell,
    ChevronDown
} from "lucide-react";

function Topbar() {

    return (
        <header className="topbar">

            <div>

                <p className="breadcrumb">
                    NER Intelligence / Dashboard
                </p>

                <h1>
                    Operations Overview
                </h1>

            </div>

            <div className="topbar-actions">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search incidents..."
                    />

                    <span>⌘ K</span>

                </div>

                <button className="icon-button">

                    <Bell size={19} />

                    <span className="bell-dot"></span>

                </button>

                <div className="profile">

                    <div className="avatar">
                        A
                    </div>

                    <div className="profile-info">

                        <strong>
                            Admin
                        </strong>

                        <span>
                            Operations
                        </span>

                    </div>

                    <ChevronDown size={16} />

                </div>

            </div>

        </header>
    );
}

export default Topbar;
import React from "react";
import useMockData from "../utils/mockData";
import history from "../utils/history";
const Main = () => {
    const { error, progress, status } = useMockData();
    const handleClick = () => {
        history.push("/login");
    };
    return (
        <div className="container mt-5">
            <h1> Main Page</h1>
            <h3>Добро пожаловать в систему знакомств</h3>
            <ul>
                <li>Status:{status}</li>
                <li>Progress: {progress}%</li>
                {error && <li>error: {error}</li>}
            </ul>
            <button className="btn btn-primary" onClick={handleClick}>
                {" "}
                Войти
            </button>
        </div>
    );
};

export default Main;

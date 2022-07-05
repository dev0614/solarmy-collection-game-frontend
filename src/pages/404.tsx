import Header from "../components/Header";
import Menu from "../components/Menu";
import { MainPage } from "../components/Widget";

export default function NoMatchedPage() {
    return (
        <MainPage>
            <div className="notmached-content">
                <h1>404</h1>
                <p>This page could not be found.</p>
            </div>
            <Menu />
        </MainPage>
    )
}
import SecondaryTopMenuBar from "../components/SecondaryTopMenuBar";
import TopMenuBar from "../components/TopMenuBar";
import BottomMenuBar from "../components/BottomMenuBar";
import InitialBody from "../components/InitialBody";

function Home(){
    return(
        <>
            <TopMenuBar />
            <SecondaryTopMenuBar />
            <BottomMenuBar />
            <InitialBody />
        </>
    )
}
export default Home;
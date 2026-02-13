import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
    const [step, setStep] = useState(1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Apology section states
    const [apologyStage, setApologyStage] = useState(0);
    const [apologyAccepted, setApologyAccepted] = useState(false);
    const [acceptBtnSize, setAcceptBtnSize] = useState(1);
    const [rejectClickCount, setRejectClickCount] = useState(0);
    const [rejectBtnOpacity, setRejectBtnOpacity] = useState(1);
    const [rejectBtnWidth, setRejectBtnWidth] = useState("auto");

    // Shyari section states
    const [shyariClicked, setShyariClicked] = useState(false);

    // Proposal section states
    const [yesSize, setYesSize] = useState(1);
    const [noClickCount, setNoClickCount] = useState(0);
    const [proposalAccepted, setProposalAccepted] = useState(false);
    const [noBtnOpacity, setNoBtnOpacity] = useState(1);
    const [noBtnWidth, setNoBtnWidth] = useState("auto");

    // Track window width for responsive adjustments
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // APOLOGY HANDLER
    const handleApology = (action) => {
        if (action === "accept") {
            setApologyAccepted(true);
            setStep(2);
        } else {
            const newCount = rejectClickCount + 1;
            setRejectClickCount(newCount);
            setApologyStage((prev) => (prev + 1) % 4);

            // Smaller growth on mobile
            const growthFactor = windowWidth <= 480 ? 0.3 : 0.4;
            setAcceptBtnSize((prev) => prev + growthFactor);

            if (newCount >= 4) {
                const hideFactor = Math.min(1, (newCount - 3) * 0.33);
                setRejectBtnOpacity(Math.max(0, 1 - hideFactor));
                setRejectBtnWidth(hideFactor >= 1 ? "0px" : "auto");
            }
        }
    };

    const getRejectionMessage = () => {
        switch(apologyStage) {
            case 1: return windowWidth <= 480 ? "sorry 😔" : "sorry na jaan 😔";
            case 2: return windowWidth <= 480 ? "maaf krdo 🥺" : "maaf krdo please 🥺";
            case 3: return windowWidth <= 480 ? "please 😭" : "please na jaan 😭";
            default: return "";
        }
    };

    const handleShyariClick = () => {
        if (apologyAccepted) {
            setShyariClicked(true);
            setStep(3);
        }
    };

    // PROPOSAL HANDLER
    const handleProposal = (answer) => {
        if (answer === "yes") {
            setProposalAccepted(true);
            setStep(4);
        } else {
            const newCount = noClickCount + 1;
            setNoClickCount(newCount);

            // Smaller growth on mobile
            const growthFactor = windowWidth <= 480 ? 0.3 : 0.4;
            setYesSize((prev) => prev + growthFactor);

            if (newCount >= 4) {
                const hideFactor = Math.min(1, (newCount - 3) * 0.33);
                setNoBtnOpacity(Math.max(0, 1 - hideFactor));
                setNoBtnWidth(hideFactor >= 1 ? "0px" : "auto");
            }
        }
    };

    const resetToStart = () => {
        setStep(1);
        setApologyStage(0);
        setApologyAccepted(false);
        setAcceptBtnSize(1);
        setRejectClickCount(0);
        setRejectBtnOpacity(1);
        setRejectBtnWidth("auto");
        setShyariClicked(false);
        setYesSize(1);
        setNoClickCount(0);
        setProposalAccepted(false);
        setNoBtnOpacity(1);
        setNoBtnWidth("auto");
    };

    return (
        <div className="app">
            {/* Responsive animated blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>

            {/* Responsive particles - fewer on mobile */}
            <div className="particles">
                {[...Array(windowWidth <= 480 ? 10 : 20)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        fontSize: `${Math.random() * (windowWidth <= 480 ? 1.5 : 2) + 1}rem`
                    }}>❤️</div>
                ))}
            </div>

            <div className="card-container">
                {/* SLIDE 1: APOLOGY */}
                {step === 1 && (
                    <div className="card slide-1">
                        <div className="card-content">
                            <div className="icon-header">
                                <span className="heart-icon">💖</span>
                                <span className="heart-icon">💕</span>
                                <span className="heart-icon">💗</span>
                            </div>

                            <h1 className="title">sorry my jaan</h1>

                            <div className="message-card">
                                <p>
                                    meri hi glti h<br />
                                    me kisi or chiz ki vjh se mood khrab tha<br />
                                    <span className="small-text">jesa mene insta p btya</span>
                                </p>
                                <div className="emoji">😔💔</div>
                            </div>

                            {apologyStage > 0 && (
                                <div className={`rejection-chip stage-${apologyStage}`}>
                                    {getRejectionMessage()}
                                </div>
                            )}

                            <div className="button-group apology-group">
                                <button
                                    className="btn accept-btn"
                                    style={{
                                        transform: `scale(${acceptBtnSize})`,
                                        zIndex: acceptBtnSize > 1.5 ? 10 : 1,
                                        marginRight: windowWidth > 480 && acceptBtnSize > 2 ? "-20px" : "0",
                                    }}
                                    onClick={() => handleApology("accept")}
                                >
                                    <span className="btn-text">
                                        {windowWidth <= 480 ? "Accept 💖" : "Apology Accepted 💖"}
                                    </span>
                                </button>

                                <button
                                    className="btn reject-btn"
                                    onClick={() => handleApology("reject")}
                                    style={{
                                        opacity: rejectBtnOpacity,
                                        width: rejectBtnWidth,
                                        pointerEvents: rejectBtnOpacity < 0.1 ? "none" : "auto",
                                        transform: rejectBtnOpacity < 0.1 ? "scale(0)" : "scale(1)",
                                        display: rejectBtnWidth === "0px" ? "none" : "flex",
                                    }}
                                >
                                    <span className="btn-text">Reject 😢</span>
                                </button>
                            </div>

                            {rejectBtnOpacity < 0.2 && (
                                <div className="floating-message">
                                    <span className="floating-emoji">🙈</span>
                                    {windowWidth <= 480 ? "can't reject!" : "can't reject now!"}
                                </div>
                            )}

                            {rejectClickCount > 0 && (
                                <div className="message-stack">
                                    <div className={`urgent-message ${rejectClickCount > 3 ? 'urgent' : ''}`}>
                                        {rejectClickCount > 3
                                            ? (windowWidth <= 480 ? 'PLEASE ACCEPT!' : 'PLEASE ACCEPT')
                                            : (windowWidth <= 480 ? "DON'T REJECT!" : "PLEASE DON'T REJECT")}
                                    </div>

                                    {rejectClickCount > 2 && (
                                        <div className="desperate-text">
                                            {windowWidth <= 480 ? "please accept 🥺" : "please accept my apology 🥺"}
                                        </div>
                                    )}

                                    {rejectClickCount > 4 && (
                                        <div className="final-message">
                                            💘 {windowWidth <= 480 ? "Only ACCEPT now!" : "You can only say ACCEPT now!"} 💘
                                        </div>
                                    )}
                                </div>
                            )}


                        </div>
                    </div>
                )}

                {/* SLIDE 2: Shyari */}
                {step === 2 && (
                    <div className="card slide-2">
                        <div className="card-content">
                            <div className="icon-header">
                                <span className="star-icon">✨</span>
                                <span className="star-icon">🌸</span>
                                <span className="star-icon">✨</span>
                            </div>

                            <div className="shyari-container">
                                <p className="shyari-line">Ek baat batau tumhe, dil ki zubani,</p>
                                <p className="shyari-line">Tumse hi milti hai mujhe har khushi ki nishani,</p>
                                <p className="shyari-line">Tumhari ek muskurahat pe marta hai yeh dil,</p>
                                <p className="shyari-line last">Kaise kahoon tum ho meri zindagi ki rawaani</p>
                                <div className="shyari-emoji">😘🌸</div>
                            </div>

                            <button
                                className={`btn wah-btn ${shyariClicked ? 'clicked' : ''}`}
                                onClick={handleShyariClick}
                            >
                                <span className="btn-text">wah wah</span>
                                <span className="btn-emoji">🌟</span>
                            </button>

                            {shyariClicked && (
                                <div className="next-hint">
                                    🤭 {windowWidth <= 480 ? "agle slide pe..." : "aagye aap agle slide pe..."}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SLIDE 3: PROPOSAL */}
                {step === 3 && (
                    <div className="card slide-3">
                        <div className="card-content">
                            <div className="icon-header">
                                <span className="heart-icon">💝</span>
                                <span className="heart-icon">💖</span>
                                <span className="heart-icon">💘</span>
                            </div>

                            <h2 className="proposal-title">
                                {windowWidth <= 480 ? "Happy Valentine's" : "Happy Valentine's Day"}
                            </h2>

                            <div className="love-message">
                                <p>{windowWidth <= 480 ? "my love, my panta" : "my love, my panta, my Gauri,"}</p>
                                <p>{windowWidth <= 480 ? "my strength ❤️" : "my strength, my power, my heart"}</p>
                                <div className="heart-decoration">❤️</div>
                            </div>

                            <h3 className="question">
                                {windowWidth <= 480
                                    ? "Be my Valentine forever?"
                                    : "Will you be my Valentine for the rest of my life?"}
                            </h3>

                            <div className="button-group proposal-group">
                                <button
                                    className="btn yes-btn"
                                    style={{
                                        transform: `scale(${yesSize})`,
                                        zIndex: yesSize > 1.5 ? 10 : 1,
                                        marginRight: windowWidth > 480 && yesSize > 2 ? "-20px" : "0",
                                    }}
                                    onClick={() => handleProposal("yes")}
                                >
                                    <span className="btn-text">YES 💕</span>
                                </button>

                                <button
                                    className="btn no-btn"
                                    onClick={() => handleProposal("no")}
                                    style={{
                                        opacity: noBtnOpacity,
                                        width: noBtnWidth,
                                        pointerEvents: noBtnOpacity < 0.1 ? "none" : "auto",
                                        transform: noBtnOpacity < 0.1 ? "scale(0)" : "scale(1)",
                                        display: noBtnWidth === "0px" ? "none" : "flex",
                                    }}
                                >
                                    <span className="btn-text">No 😢</span>
                                </button>
                            </div>

                            {noBtnOpacity < 0.2 && (
                                <div className="floating-message">
                                    <span className="floating-emoji">🙈</span>
                                    {windowWidth <= 480 ? "can't say no!" : "can't say no now!"}
                                </div>
                            )}

                            {noClickCount > 0 && (
                                <div className="message-stack">
                                    <div className={`urgent-message ${noClickCount > 3 ? 'urgent' : ''}`}>
                                        {noClickCount > 3
                                            ? (windowWidth <= 480 ? 'SAY YES!' : 'PLEASE SAY YES')
                                            : (windowWidth <= 480 ? "DON'T SAY NO!" : "PLEASE DON'T SAY NO")}
                                    </div>

                                    {noClickCount > 2 && (
                                        <div className="desperate-text">
                                            {windowWidth <= 480 ? "please yes! 🥺" : "please yes! I'm sorry 🥺"}
                                        </div>
                                    )}

                                    {noClickCount > 4 && (
                                        <div className="final-message">
                                            💘 {windowWidth <= 480 ? "Only YES now!" : "You can only say YES now!"} 💘
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SLIDE 4: Congratulations */}
                {step === 4 && (
                    <div className="card slide-4">
                        <div className="card-content">
                            <div className="celebration">
                                <span className="celeb-emoji">🎉</span>
                                <span className="celeb-emoji">💖</span>
                                <span className="celeb-emoji">🎉</span>
                            </div>

                            <h1 className="congrats-title">
                                {windowWidth <= 480 ? "CONGRATS!" : "CONGRATULATIONS"}
                            </h1>
                            <h2 className="name-title">MRS. GAGAN</h2>

                            <div className="thankyou-message">
                                <p>Thank you for always loving</p>
                                <p>and choosing me.</p>
                            </div>

                            <div className="love-quote">
                                <span className="quote-heart">❤️</span>
                                {windowWidth <= 480 ? "I love you!" : "I love you, Gauri!"}
                                <span className="quote-heart">❤️</span>
                            </div>

                            <button className="btn reset-btn" onClick={resetToStart}>
                                <span className="btn-text">
                                    {windowWidth <= 480 ? "start over 💞" : "start over 💞"}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
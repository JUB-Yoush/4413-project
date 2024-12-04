import React from 'react';

interface Size{
    size: number;
}

const Logo: React.FC<Size> = (siz: Size) => {
    return (
        <div className="grid grid-cols-1 justify-center">
            {/* DJ WAMP Logo */}
            <p className="basis-[20%] flex justify-start"
                style={{
                    color: "#000",
                    fontFamily: "'Lexend Zetta', sans-serif",
                    fontSize: siz.size,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                }}>DJ WAMP</p>
        </div>
    );
};

export default Logo;
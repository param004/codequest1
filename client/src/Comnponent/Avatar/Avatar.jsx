import React from 'react'

function Avatar({
    children,
    backgroundColor,
    px,
    py,
    color,
    borderRadius,
    fontSize,
    cursor,
    avatar, // new prop for avatar URL
    size = "40px" // default size
}) {
    const style = {
        backgroundColor,
        padding: avatar ? 0 : `${py} ${px}`,
        color: color || "black",
        borderRadius: borderRadius || "50%",
        fontSize,
        textAlign: "center",
        cursor: cursor || null,
        textDecoration: "none",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    };

    return avatar ? (
        <img
            src={avatar}
            alt="avatar"
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ccc",
                background: "#f7fafd"
            }}
        />
    ) : (
        <div style={style}>{children}</div>
    );
}

export default Avatar
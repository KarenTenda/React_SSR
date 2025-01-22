import Image from "next/image";
import React from "react";

function NotificationsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center">
                <Image
                    src="/images/undraw_web-developer_ggt0.svg"
                    alt="Description of the SVG"
                    width={500}
                    height={500}
                />
                <p className="text-lg text-gray-500">Notifications Page Underdevelopment.</p>
            </div>
        </div>
    )
}

export default NotificationsPage;
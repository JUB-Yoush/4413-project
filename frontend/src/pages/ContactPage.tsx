import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className={"flex flex-row min-h-screen px-10 pb-10 gap-10"}>
        {/*    Image on the side */}
            <div className={"relative max-w-[15%] min-h-full overflow-hidden"}>
                <img
                    src={"cassettes.png"}
                    alt={"decorative photo of cassettes"}
                    className={"min-h-full object-cover"}/>
            </div>

            <div className={"flex flex-col flex-grow gap-7"}>
                <h1 className={"text-2xl"}>Contact Us</h1>
                <p>Please include your order number and full name with your inquiry to prevent delayed response.
                    <br/><br/>
                    We typically respond to emails within 24 business hours. Weekend inquiries will be addressed by the following business Tuesday.
                    <br/><br/>
                    We ship out of warehouses in Nigeria so order fulfilment usually take 13-20 business days. We thank you for your patience.</p>
                <div className={"text-left flex flex-col gap-4"}>
                    <div className={"text-camel font-bold flex flex-row gap-3"}>
                        <p className={"w-24"}>Contact Method</p>
                        <p className={"w-48"}>Detail</p>
                        <p className={"flex-grow"}>Hours</p>
                    </div>
                    <div className={"flex flex-row gap-3"}>
                        <p className={"text-camel font-bold w-24"}>Email Us</p>
                        <a href={"mailto:djwamp@wampin.rn"} className={"w-48"}><p className={""}>djwamp@wampin.rn</p></a>
                        <p className={"flex-grow"}>Monday - Friday, 9-5pm</p>

                    </div>
                    <div className={"flex flex-row gap-3"}>
                        <p className={"text-camel font-bold w-24"}>Call Us</p>
                        <p className={"w-48"}>Within Canada <br/> 1-(123)-456-7890</p>
                        <p className={"flex-grow"}>Monday - Friday, 9-5pm</p>
                    </div>
                </div>
            </div>

            {/*    Image on the side */}
            <div className={"relative max-w-[15%] min-h-full overflow-hidden"}>
                <img
                    src={"cassettes.png"}
                    alt={"decorative photo of cassettes"}
                    className={"min-h-full object-cover"}/>
            </div>
        </div>
    );
};

export default ContactPage;
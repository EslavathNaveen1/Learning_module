import React from "react";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MainHome from "./MainHome";

const Contact = () => {
  return (
    <>
  
<div className=" mx-auto p-6 text-center bg-[#333] mt-10">
<h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
<p className="text-gray-300 text-s mb-4">
        Have any questions? Reach out to us, and we'll be happy to assist you!
</p>
<div className="text-lg text-gray-200 mb-4">
<p>Email: <a href="mailto:support@qtech.com" className="text-white font-semibold">support@qtech.com</a></p>
<p>Phone: <span className="font-semibold">+91 98765 43210</span></p>
<p>Address: <span className="font-semibold">Warangal, Telangana, India</span></p>
</div>
<h3 className="text-xl font-semibold text-white mb-3">Follow Us</h3>
<div className="flex justify-center gap-6 text-white text-2xl">
<FacebookIcon></FacebookIcon>
<InstagramIcon></InstagramIcon>
<LinkedInIcon></LinkedInIcon>

</div>
</div>
</>
  );
};
 
export default Contact;
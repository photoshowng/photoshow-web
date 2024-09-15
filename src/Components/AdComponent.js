import React, { useEffect } from "react";

const AdComponent = () => {
  useEffect(() => {
    // Ensure window.adsbygoogle exists before pushing
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "250px" }}>  {/* Ensure a width and height */}
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1594996758190251"
        data-ad-slot="2225687244"
        //data-ad-slot="0000000000"  // Google's test ad unit ID
        data-ad-format="auto"
        data-full-width-responsive="true">
      </ins>
    </div>
  );
};

export default AdComponent;

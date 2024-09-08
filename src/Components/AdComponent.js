import React, { useEffect } from "react";

const AdComponent = () => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div>
    <ins className="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-6943346311082906"
    data-ad-slot="3936647754"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdComponent;

import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { auth } from "@/services/firebase";

export default function KonsultasiCall() {
  const { roomId } = useParams();
  const divRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      const domain = "meet.jit.si";
      const options = {
        roomName: decodeURIComponent(roomId),
        parentNode: divRef.current,
        userInfo: { displayName: auth.currentUser?.email || "User" },
        configOverwrite: { prejoinPageEnabled: true },
        interfaceConfigOverwrite: { TILE_VIEW_MAX_COLUMNS: 2 }
      };
      // eslint-disable-next-line no-undef
      new JitsiMeetExternalAPI(domain, options);
    };
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [roomId]);

  return <div className="w-full h-screen" ref={divRef} />;
}

import { Icon } from "@iconify/react";
import { useContext, useEffect, useRef, useState } from "react";
import { NotificationContext } from "../../contexts/notification-context";
import "./styles.scss";
import Button from "../button";
import { Link } from "react-router-dom";

const Notif = function ({ data }: { data: Notification | any }) {
  const { close } = useContext(NotificationContext);
  const [timer, setTimer] = useState<any>(null);
  const [outAnimation, setOutAnimation] = useState("");

  const effectCount = useRef(0);

  function clearTimer() {
    clearTimeout(timer);
  }

  function startTimer() {
    if (data?.options?.timeout == "never") return;
    setTimer(setTimeout(() => closeNoti(data?.id), data?.options?.timeout));
  }

  function closeNoti(id: any) {
    setOutAnimation("animate-out");
    setTimeout(() => close(id), 400);
  }

  useEffect(() => {
    if (effectCount.current > 0) return;
    startTimer();
    return () => {
      effectCount.current++;
    };
  }, []);
  return (
    <div
      key={data?.id || "none"}
      className={`toast-message ${
        data?.type
      } duration-500 slide-out-to-right slide-in-from-bottom ${
        outAnimation ? outAnimation : "animate-in"
      }`}
      id={data?.id || "none"}
      onMouseEnter={() => data.id && clearTimer()}
      onMouseLeave={() => data.id && startTimer()}
      onTouchStart={() => data.id && clearTimer()}
      onTouchEnd={() => data.id && startTimer()}
    >
      <Icon
        icon={
          data.type == "error"
            ? "mdi:cancel"
            : data.type == "success"
            ? "mdi:check-circle-outline"
            : "mdi:information"
        }
        className="icon min-w-fit max-w-fit"
      />
      <div className="w-full flex flex-col gap-1">
        <h4 className="text">{data.message}</h4>
        <div className="flex gap-2 items-center">
          {data?.options?.actions?.length > 0 ? (
            <>
              {data?.options?.actions?.map((action: any) =>
                action?.type == "link" ? (
                  <Link
                    to={action?.action}
                    style={{ display: "contents" }}
                    onClick={() =>
                      action?.closeOnClick ? closeNoti(data?.id) : false
                    }
                  >
                    <Button
                      variant="light"
                      color="accent"
                      className="py-1"
                      radius="full"
                    >
                      {action?.text}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="light"
                    color="accent"
                    radius="full"
                    onClick={() => {
                      action?.action();
                      closeNoti(data?.id);
                    }}
                    className="py-1"
                  >
                    {action?.text}
                  </Button>
                )
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Icon
        icon="mdi-close"
        className="icon text-xl min-w-fit max-w-fit"
        onClick={() => closeNoti(data.id)}
      />
    </div>
  );
};

export default function Snackbar() {
  const { notifications } = useContext(NotificationContext);

  return notifications.filter((i) => i.show).length > 0 ? (
    <div className="snackbar z-[9999] pointer-events-none fixed h-screen w-screen flex justify-end p-6">
      <div className="message-wrapper pointer-events-auto w-full max-w-[350px] flex flex-col gap-4 h-fit">
        {notifications
          .filter((i) => i.show)
          .map((data) => (
            <Notif data={data} key={data.id} />
          ))}
      </div>
    </div>
  ) : (
    <></>
  );
}

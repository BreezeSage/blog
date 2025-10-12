import type { FC } from "hono/jsx";
import dayjs from "dayjs";

interface EmailProps {
  title: string;
  subTitle: string;
  imageUrl: string;
}

const Email: FC<EmailProps> = (props) => {
  const date1 = dayjs("2025-09-07");
  const date2 = dayjs();
  const dayDiff = date2.diff(date1, "day") + 1; // 返回 3684 [1]

  return (
    <div>
      <img
        src={props.imageUrl}
        alt=""
        style={{
          width: "100%",
        }}
      />

      <h2>{props.title}</h2>
      <p>「 {props.subTitle} 」</p>
      <p style={{ fontSize: "14px" }}>
        Love you deeply. 深深爱着你（第 {dayDiff} 天）
      </p>
    </div>
  );
};

export default Email;

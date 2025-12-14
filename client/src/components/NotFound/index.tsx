import styles from "./notFound.module.css";

interface NotFoundProps {
  title: string;
  message: string;
}

function NotFound({ title, message }: NotFoundProps) {
  return (
    <div className={styles["notFound"]}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export default NotFound;

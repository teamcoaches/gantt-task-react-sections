import React, { useEffect } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

const TaskListItem: React.FC<{
  section: string;
  rowHeight: number;
  rowWidth: string;
  tasks: Task[];
}> = ({ section, rowHeight, rowWidth, tasks }) => {

  // This state will be used to show and hide sections with task
  // and asign visible and novisible to the items
  const [show, setShow] = React.useState<boolean>(true);
  const [globalProgress, setGlobalProgress] = React.useState<number>(0);


  const handleClick = () => {
    setShow(!show);
  };

  useEffect(()=>{
    calculateProgress()
  })

  const calculateProgress = () => {
    let progressCount = 0; // var thet will contain the sume of the sections tasks progress
    let i = 0; // Tasks' number
    tasks.filter(task => task.section === section)
    .map(( task ) => {
      progressCount = progressCount + task.progress;
      i++
    });
    setGlobalProgress( Math.floor(progressCount / i));
  }

  return(
    <div key={section}>
      <div
        className={styles.taskListTableRow}
        style={{ height: rowHeight }}
      >
        <div
          className={styles.taskListCell}
          style={{
            minWidth: rowWidth,
            maxWidth: rowWidth,
          }}
          title={section}
        >
          <button className={styles.button} onClick={handleClick}>
            {show ? "-" : "+"}
          </button>
          &nbsp;{section}
        </div>

        <div
          className={styles.taskListCell}
          style={{
            minWidth: rowWidth,
            maxWidth: rowWidth,
          }}
        >
            {show ? "" : `${globalProgress}%`}
        </div>

      </div>
      <div
        className={
          show ? `${styles.taskContainer}` : `${styles.taskContainer} ${styles.toggle}`}
      >
        {
        tasks
          .filter(task => task.section === section)
          .map(task => {
            return (
              <div
                className={styles.taskListTableRow}
                style={{ height: rowHeight }}
                key={task.id}
              >
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                  title={task.name}
                >
                  &nbsp;{task.name}
                </div>
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                >
                  &nbsp;{task.progress}%
                </div>
              </div>
            );
        })
        }
        </div>
    </div>
  );
}

export default TaskListItem;

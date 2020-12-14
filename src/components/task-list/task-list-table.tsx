import React from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  sections: string[];
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
}> = ({ rowHeight, rowWidth, sections, tasks, fontFamily, fontSize }) => {
  // This state will be used to show and hide sections with task
  // and asign visible and novisible to the items
  // const [show, setShow] = React.useState<boolean>(false);

  // const handleOnClick () => {
  //   setShow(!show)
  // }

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {sections.map(section => {
        return (
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
                <button className={styles.button}>+</button>
                &nbsp;{section}
              </div>
            </div>
            {tasks
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
              })}
          </div>
        );
      })}
    </div>
  );
};

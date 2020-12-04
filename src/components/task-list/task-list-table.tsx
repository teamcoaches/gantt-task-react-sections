import React from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  sections: any[];
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
}> = ({ rowHeight, rowWidth, sections, tasks, fontFamily, fontSize }) => {
  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {sections.map(s => {
        return (
          <div key={`${s.id}row`}>
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
                title={s.name}
              >
                &nbsp;{s.name}
              </div>
            </div>
            {tasks.map((t: Task) => {
              if (t.section === s.name) {
                return (
                  <div
                    className={styles.taskListTableRow}
                    style={{ height: rowHeight }}
                    key={t.id}
                  >
                    <div
                      className={styles.taskListCell}
                      style={{
                        minWidth: rowWidth,
                        maxWidth: rowWidth,
                      }}
                      title={t.name}
                    >
                      &nbsp;{t.name}
                    </div>
                    <div
                      className={styles.taskListCell}
                      style={{
                        minWidth: rowWidth,
                        maxWidth: rowWidth,
                      }}
                    >
                      &nbsp;{t.progress}%
                    </div>
                  </div>
                );
              } else {
                return <></>;
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

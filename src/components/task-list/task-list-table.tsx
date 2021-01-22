import React from "react";
import styles from "./task-list-table.module.css";
import TaskListItem from "./task-list-item";
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
}> = ({ fontFamily, fontSize, sections, rowHeight, rowWidth, tasks }) => {


  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {sections.map((section) =>
          <TaskListItem
            section={ section }
            rowHeight={ rowHeight }
            rowWidth={ rowWidth }
            tasks={tasks}
          />
      )}
    </div>
  );
};

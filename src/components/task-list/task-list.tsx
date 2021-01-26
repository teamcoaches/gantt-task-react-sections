import React, { useEffect, useRef } from "react";
import { Task } from "../../types/public-types";

export type TaskListProps = {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  scrollY: number;
  locale: string;
  sections: any[];
  tasks: Task[];
  showTaskList: boolean;
  horizontalContainerClass?: string;
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }>;
  TaskListTable: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    sections: any[];
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
  }>;
};

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  sections,
  tasks,
  selectedTaskId,
  setSelectedTask,
  showTaskList,
  locale,
  ganttHeight,
  horizontalContainerClass,
  TaskListHeader,
  TaskListTable,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
  };
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    sections,
    tasks,
    locale,
    selectedTaskId,
    setSelectedTask,
  };

  return (
  <div style={showTaskList ? {width:"fit-content"} : {width: "0%"}}>
    <TaskListHeader {...headerProps} />
    <div
      ref={horizontalContainerRef}
      className={horizontalContainerClass}
      style={ganttHeight ? { height: ganttHeight } : {}}
    >
      <TaskListTable {...tableProps} />
    </div>
  </div>
  );
};

import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  createContext,
} from "react";
import { ViewMode, GanttProps, Task } from "../../types/public-types";
import { GridProps } from "../grid/grid";
import { ganttDateRange, seedDates } from "../../helpers/date-helper";
import { CalendarProps } from "../calendar/calendar";
import { TaskGanttContentProps } from "./task-gantt-content";
import { TaskListHeaderDefault } from "../task-list/task-list-header";
import { TaskListTableDefault } from "../task-list/task-list-table";
import { StandardTooltipContent } from "../other/tooltip";
import { Scroll } from "../other/scroll";
import { TaskListProps, TaskList } from "../task-list/task-list";
import styles from "./gantt.module.css";
import { TaskGantt } from "./task-gantt";

type ShowTaskContextType = {
  showTask: number;
  setShowTask: (value: number) => void;
};

export const ShowTaskContext = createContext<ShowTaskContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const ShowTaskContextProvider = ({ children }: Props) => {
  const [showTask, setShowTask] = useState(0);

  return (
    <ShowTaskContext.Provider value={{ showTask, setShowTask }}>
      {children}
    </ShowTaskContext.Provider>
  );
};

export const Gantt: React.SFC<GanttProps> = ({
  sections,
  tasks,
  headerHeight = 50,
  columnWidth = 60,
  listCellWidth = "155px",
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  locale = "en-GB",
  barFill = 60,
  barCornerRadius = 3,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282f5",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#aeb8c2",
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = "grey",
  fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  fontSize = "14px",
  arrowIndent = 20,
  todayColor = "rgba(252, 248, 227, 0.5)",
  TooltipContent = StandardTooltipContent,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault,
  showTaskList = true,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onTaskDelete,
  onSelect,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ganttTasks, setGanttTasks] = useState<Task[]>(tasks);
  const [ganttSections, setGanttSections] = useState<any[]>(sections);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);
  const [startDate, endDate] = ganttDateRange(ganttTasks, viewMode);
  const dates = seedDates(startDate, endDate, viewMode);

  // Here the height of the SVG gantt
  const svgHeight = rowHeight * (ganttTasks.length + ganttSections.length);
  const gridWidth = dates.length * columnWidth;
  const gridHeight = "100%";

  // Here is height of the gantt
  const ganttFullHeight =
    (ganttTasks.length + ganttSections.length) * rowHeight;

  useEffect(() => {
    setGanttTasks(tasks);
    setGanttSections(sections);
  }, [tasks]);

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const newScrollY = scrollY + event.deltaY;
      if (newScrollY < 0) {
        setScrollY(0);
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        setScrollY(ganttFullHeight - ganttHeight);
      } else {
        setScrollY(newScrollY);
      }
      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    if (
      wrapperRef.current &&
      ganttHeight &&
      ganttHeight < ganttTasks.length * rowHeight
    ) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [wrapperRef.current, scrollY, ganttHeight, ganttTasks, rowHeight]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop);
    }
    setIgnoreScrollEvent(false);
  };

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft);
    }
    setIgnoreScrollEvent(false);
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        newScrollY += rowHeight;
        isX = false;
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        newScrollY -= rowHeight;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= columnWidth;
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        setScrollX(0);
      } else if (newScrollX > gridWidth) {
        setScrollX(gridWidth);
      } else {
        setScrollX(newScrollX);
      }
    } else {
      if (newScrollY < 0) {
        setScrollY(0);
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        setScrollY(ganttFullHeight - ganttHeight);
      } else {
        setScrollY(newScrollY);
      }
    }
    setIgnoreScrollEvent(true);
  };

  // task change event
  const handleTasksChange = (tasks: Task[]) => {
    setGanttTasks(tasks);
  };

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const newSelectedTask = ganttTasks.find(t => t.id === taskId);
    if (newSelectedTask) {
      if (onSelect) {
        const oldSelectedTask = ganttTasks.find(t => t.id === selectedTask);
        if (oldSelectedTask) {
          onSelect(oldSelectedTask, false);
        }
        onSelect(newSelectedTask, true);
      }
      setSelectedTask(newSelectedTask.id);
    } else {
      if (onSelect) {
        const oldSelectedTask = ganttTasks.find(t => t.id === selectedTask);
        if (oldSelectedTask) {
          onSelect(oldSelectedTask, false);
        }
      }
      setSelectedTask("");
    }
  };

  const gridProps: GridProps = {
    columnWidth,
    gridWidth,
    gridHeight,
    sections: ganttSections,
    tasks: ganttTasks,
    rowHeight,
    dates,
    todayColor,
  };
  const calendarProps: CalendarProps = {
    dates,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
  };
  const barProps: TaskGanttContentProps = {
    sections: ganttSections,
    tasks: ganttTasks,
    selectedTask,
    setSelectedTask: handleSelectedTask,
    rowHeight,
    barCornerRadius,
    columnWidth,
    dates,
    barFill,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    handleWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgHeight,
    onTasksChange: handleTasksChange,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onTaskDelete,
    TooltipContent,
  };

  const tableProps: TaskListProps = {
    rowHeight,
    rowWidth: listCellWidth,
    fontFamily,
    fontSize,
    sections: ganttSections,
    tasks: ganttTasks,
    locale,
    headerHeight,
    scrollY,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    selectedTaskId: selectedTask,
    setSelectedTask: handleSelectedTask,
    TaskListHeader,
    TaskListTable,
    showTaskList: showTaskList,
  };

  return (
    <ShowTaskContextProvider>
      <div
        className={styles.wrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        <TaskList {...tableProps} />
        <TaskGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          scrollY={scrollY}
          scrollX={scrollX}
          onScroll={handleScrollX}
        />
        <Scroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY}
          onScroll={handleScrollY}
        />
      </div>
    </ShowTaskContextProvider>
  );
};

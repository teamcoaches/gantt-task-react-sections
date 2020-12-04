import React from "react";
import "gantt-task-react/dist/index.css";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";

//Init
const App = () => {
  const currentDate = new Date();
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [isChecked, setIsChecked] = React.useState(true);
  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  let sections: any[] = [
    {
      id: "1",
      name: "Program 1",
    },
    {
      id: "2",
      name: "Program 2",
    },
  ];

  let tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      name: "Task 1",
      id: "Task 0",
      progress: 45,
      section: "Program 1",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      name: "Task 2",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      section: "Program 1",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      name: "Task 3",
      id: "Task 2",
      progress: 10,
      dependencies: ["Task 1"],
      section: "Program 2",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
      name: "Task 4",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
      section: "Program 2",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Task 5",
      id: "Task 4",
      progress: 70,
      dependencies: ["Task 2"],
      section: "Program 2",
    },
  ];

  const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  let onTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
  };

  let onTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    return conf;
  };

  let onProgressChange = async (task: Task) => {
    await sleep(5000);
    console.log("On progress change Id:" + task.id);
  };

  let onDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  let onSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  return (
    <div>
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <h3>Gantt</h3>
      <Gantt
        sections={sections}
        tasks={tasks}
        viewMode={view}
        onDateChange={onTaskChange}
        onTaskDelete={onTaskDelete}
        onProgressChange={onProgressChange}
        onDoubleClick={onDblClick}
        onSelect={onSelect}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
      />
    </div>
  );
};

export default App;

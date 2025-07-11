import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    InputAdornment,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    Button,
    Fab,
    Menu,
    MenuItem,
    CssBaseline,
    GlobalStyles,
    Grid
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const FILTERS = ["ALL", "ACTIVE", "COMPLETED"];

function App() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("tasks");
        if (stored) setTasks(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setTasks([
            ...tasks,
            { id: Date.now(), text: input.trim(), completed: false }
        ]);
        setInput("");
    };

    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
        if (filter === "ALL") return matchesSearch;
        if (filter === "ACTIVE") return !task.completed && matchesSearch;
        if (filter === "COMPLETED") return task.completed && matchesSearch;
        return true;
    });

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleFilterClose = (filterValue) => {
        setAnchorEl(null);
        if (filterValue) setFilter(filterValue);
    };

    return (
        <>
            {/* Google Fonts Poppins */}
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
                rel="stylesheet"
            />
            <CssBaseline />
            <GlobalStyles styles={{ body: { fontFamily: "'Poppins', sans-serif" } }} />
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #b3c6fc 0%, #ffffff 100%)"
                }}
            >
                <Grid container justifyContent="center">
                    <Grid
                        item
                        xs={12}
                        display="flex"
                        justifyContent="center"
                    >
                        <Paper
                            elevation={6}
                            sx={{
                                width: "100%",
                                maxWidth: "100vw",
                                minHeight: 480,
                                p: 4,
                                borderRadius: 4,
                                background: "#fff",
                                position: "relative",
                                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <Typography
                                variant="h1"
                                align="center"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "2.2rem",
                                    letterSpacing: 2,
                                    fontFamily: "'Poppins', sans-serif"
                                }}
                            >
                                TODO LIST
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Search tasks..."
                                    size="small"
                                    fullWidth
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    sx={{
                                        background: "#f5f5fa",
                                        "& .MuiInputBase-input": {
                                            fontFamily: "'Poppins', sans-serif"
                                        }
                                    }}
                                    slots={{
                                        startAdornment: InputAdornment
                                    }}
                                    slotProps={{
                                        startAdornment: {
                                            position: "start",
                                            children: <SearchIcon color="primary" />
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        ml: 2,
                                        minWidth: 70,
                                        bgcolor: "#7c6dfa",
                                        "&:hover": { bgcolor: "#5b4fc1" },
                                        borderRadius: 2,
                                        fontFamily: "'Poppins', sans-serif"
                                    }}
                                    endIcon={<ArrowDropDownIcon />}
                                    onClick={handleFilterClick}
                                >
                                    {filter}
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => handleFilterClose()}
                                >
                                    {FILTERS.map((f) => (
                                        <MenuItem key={f} onClick={() => handleFilterClose(f)}>
                                            {f}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            <form onSubmit={handleAddTask}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Add a new task"
                                    size="small"
                                    fullWidth
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    sx={{
                                        mb: 2,
                                        "& .MuiInputBase-input": {
                                            fontFamily: "'Poppins', sans-serif"
                                        }
                                    }}
                                />
                            </form>
                            <List sx={{ minHeight: 250 }}>
                                {filteredTasks.length === 0 && (
                                    <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
                                        No tasks found.
                                    </Typography>
                                )}
                                {filteredTasks.map((task) => (
                                    <ListItem
                                        key={task.id}
                                        sx={{
                                            pl: 0,
                                            pr: 0,
                                            alignItems: "flex-start",
                                            "&:hover .MuiIconButton-root": { opacity: 1 }
                                        }}
                                        disableGutters
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => deleteTask(task.id)}
                                                sx={{ opacity: 0.7, transition: "opacity 0.3s", ml: 1 }}
                                            >
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        }
                                    >
                                        <Checkbox
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                            sx={{
                                                color: "#7c6dfa",
                                                "&.Mui-checked": { color: "#7c6dfa" }
                                            }}
                                        />
                                        <ListItemText
                                            primary={
                                                <span
                                                    style={{
                                                        display: "block",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        fontWeight: 500,
                                                        fontFamily: "'Poppins', sans-serif",
                                                        textDecoration: task.completed ? "line-through" : "none",
                                                        color: task.completed ? "#bdbdbd" : "#333"
                                                    }}
                                                >
                          {task.text}
                        </span>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Fab
                                color="primary"
                                aria-label="add"
                                sx={{
                                    position: "absolute",
                                    bottom: 24,
                                    right: 24,
                                    bgcolor: "#7c6dfa",
                                    "&:hover": { bgcolor: "#5b4fc1" }
                                }}
                                onClick={handleAddTask}
                            >
                                <AddIcon />
                            </Fab>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default App;

import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Typography, TextField, Grid, List, ListItem, ListItemText } from "@mui/material";

const RepoList = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    stars: 0,
    createdAfter: "",
    language: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos`
        );
        const sortedRepos = response.data.sort((a, b) => b.size - a.size);
        setRepos(sortedRepos);
        setFilteredRepos(sortedRepos); //Mostrar todos los repos sin filtrar
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = repos.filter(repo => {
        if (repo.stargazers_count < filterCriteria.stars) {
          return false;
        }
        if (filterCriteria.createdAfter !== "" && new Date(repo.created_at) < new Date(filterCriteria.createdAfter)) {
          return false;
        }
        return true;
      });
      setFilteredRepos(filtered);
    };

    applyFilters();
  }, [filterCriteria, repos]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterCriteria(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      <br></br>
      <Typography variant="h4">Repositorios de {username}</Typography>
      <br></br>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Número de estrellas"
            type="number"
            name="stars"
            value={filterCriteria.stars}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Fecha de creación después de"
            type="date"
            name="createdAfter"
            value={filterCriteria.createdAfter}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <List>
        {filteredRepos.map((repo) => (
          <ListItem key={repo.id}>
            <ListItemText primary={`${repo.name} - Tamaño: ${repo.size}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

RepoList.propTypes = {
  username: PropTypes.string.isRequired,
};

export default RepoList;

'use client';
import {useLocation} from "react-use";
import {Grid2} from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link';
import {ComponentDictonaryParamsType} from "@/types/componentTypes";


const PathGenerate = ({dictionary}: ComponentDictonaryParamsType) => {
  //hook to get the current path
  const {pathname} = useLocation();

  const table = pathname?.split('/');

  return <Grid2 size={12} className={'mbe-4'}>
    <Breadcrumbs>
      {table?.map((item, index) => {
        if (item === '') return null; // Skip empty segments
        if (item === 'fr' || item === 'en') {
          return (
            <Typography component={Link} underline={'hover'} color={'primary'} key={index} href={`/`}>
              {dictionary['navigation'].dashboard}
            </Typography>

          )
        }
        if (index === table.length - 1) {
          return (
            <Typography key={index}>
              {item}
            </Typography>
          );
        }
        return (
          <Typography key={index}>
            {item.charAt(0).toUpperCase() + item.slice(1)} {/* Capitalize first letter */}
          </Typography>
        );
      })}
    </Breadcrumbs>
  </Grid2>
}

export default PathGenerate;

import React from "react";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import { IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";


function RecordingCard({carddata, onClick}) {

  return (
    <div>
      <Card elevation={6} onClick={onClick}>
          <CardActionArea>
        <CardHeader
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={carddata.title}
          subheader={carddata.subtitle}  // Will be date
        />

        <CardContent>
            <Typography variant='body2' color='textSecondary'>  
                {/* Will be user-added summary */}
                {carddata.description}  
            </Typography>
        </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default RecordingCard;

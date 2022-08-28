import moment from "moment";

export const createProjectData = async (form) => {
  const req = [{
    name: '',
    description:'',
    started: null,
    ended: null,
    primaryUrl: '',
    tags: '',
    isPrivate: false,
}];

  if (typeof form.name === "string") {
    req.name = form.name;
  }

  if (typeof form.description === "string") {
    req.description = form.description;
  }

  if (moment(form.started, "MM/DD/YYYY", true).isValid()) {
	const startedUnix = moment(form.started).unix();
    req.started = startedUnix;
  } else {
	req.started = 0;
  }

  if (moment(form.ended, "MM/DD/YYYY", true).isValid()) {
	const endedUnix = moment(form.ended).unix();
    req.ended = endedUnix;
  } else {
	req.ended = 0;
  }

  if (form.tags.length > 0) {
    let newTags = form.tags?.join(", ");
    req.tags = newTags;
  } 

  if (typeof form.primaryUrl === "string") {
	const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	urlPattern.test(form.primaryUrl) ? req.primaryUrl = form.primaryUrl : req.primaryUrl = 'https://' + form.primaryUrl;
  } 

  req.isPrivate = form.isPrivate;

  return {
    name: req.name,
    description: req.description,
    started: req.started,
    ended: req.ended,
	tags: req.tags,
    primaryUrl: req.primaryUrl,
    isPrivate: req.isPrivate
  }
};

export const updateProjectData = async (newForm, oldForm) => {
  const req = [{
    name: '',
    description:'',
    started: null,
    ended: null,
    primaryUrl: '',
    tags: '',
    isPrivate: false,
}];

  if (newForm.name !== oldForm.name) {
    req.name = newForm.name;
  } else {
    req.name = oldForm.name;
  }

  if (newForm.description !== oldForm.description) {
    req.description = newForm.description;
  } else {
    req.description = oldForm.description;
  }

  if (newForm.started !== oldForm.started) {
	const startedUnix = newForm.started ? moment(newForm.started).unix() : 0;
    req.started = startedUnix;
  } else {
    req.started = oldForm.started;
  }

  if (newForm.ended !== oldForm.ended) {
      const endedUnix = newForm.ended ? moment(newForm.ended).unix() : 0;
      req.ended = endedUnix;
  } else {
    req.ended = oldForm.ended;
  }

  if (newForm.tags !== oldForm.tags) {
    // if any tag is changed
    let changedTags = false;
    const oldTags = {};

    for (const tag of oldForm.tags || []) {
      oldTags[tag] = tag;
    }

    for (const newTag of newForm.tags || []) {
      const oldTag = oldTags[newTag];
      if (oldTag !== newTag) {
        changedTags = true;
      }

      // delete to mark as processed
      delete oldTags[newTag];
    }

    // if some keys are left
    // means that a tag was removed
    if (Object.keys(oldTags).length) {
      changedTags = true;
    }

    // tags have changed
    if (changedTags) {
      req.tags = newForm.tags?.join(", ");
    }
  } else {
    req.tags = oldForm.tags?.join(", ");
  }

  if (newForm.primaryUrl !== oldForm.primaryUrl) {
    const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    urlPattern.test(newForm.primaryUrl) ? req.primaryUrl = newForm.primaryUrl : req.primaryUrl = 'https://' + newForm.primaryUrl;
  } else {
    req.primaryUrl = oldForm.primaryUrl;
  }

  if (newForm.isPrivate !== oldForm.isPrivate) {
    req.isPrivate = newForm.isPrivate;
  } else {
    req.isPrivate = oldForm.isPrivate;
  }

  return {
    name: req.name,
    description: req.description,
    started: req.started,
    ended: req.ended,
	tags: req.tags,
    primaryUrl: req.primaryUrl,
    isPrivate: req.isPrivate
  }
};

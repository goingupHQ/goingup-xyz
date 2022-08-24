export const createProjectData = async(
	form,
) => {
    const req = {
        name,
        description,
        started,
        ended,
        primaryUrl,
        tags,
        isPrivate,
    }

    console.log(form);


    if (typeof form.name === 'string') {
        req.name = form.name;
    }

    if(typeof form.description === 'string') {
        req.description = form.description;
	}

	if(new Date(form.startedUnix).getTime() > 0) {
		req.startedUnix = form.startedUnix;
	}

    if(new Date(form.startedUnix).getTime() > 0) {
		req.endedUnix = form.endedUnix;
	}

	if(form.tags.length !== 0) {
		let newTags = form.tags?.join(', ');

        req.tags = newTags;
	} else {
		req.tags = null
	}

	req.isPrivate = form.isPrivate

	return req
}

export const updateProjectData = async(
	newForm,
	oldForm,
) => {
    const req = {
        name,
        description,
        started,
        ended,
        primaryUrl,
        tags,
        isPrivate,
    }

    if (newForm.name !== oldForm.image) {
        req.name = newForm.name;
    }

    if(newForm.description !== oldForm.description) {
        req.description = newForm.description;
	}

	if(newForm.startedUnix !== oldForm.startedUnix) {
		req.startedUnix = newForm.startedUnix;
	}

    if(newForm.endedUnix !== oldForm.endedUnix) {
		req.endedUnix = newForm.endedUnix;
	}

    const oldFormTags = oldForm.tags.split(', ');

	if(newForm.tags !== oldFormTags) {
		// if any tag is changed
		let changedTags = false;
		const oldTags = {};

		for(const tag of oldFormTags || []) {
			oldTags[tag] = tag
		}

		for(const newTag of newForm.tags || []) {
			const oldTag = oldTags[newTag]
			if(
				oldTag !== oldTag
			) {
				changedTags = true
			}

			// delete to mark as processed
			delete oldTags[tag]
		}

		// if some keys are left
		// means that a tag was removed
		if(Object.keys(oldTags).length) {
			changedTags = true
		}

		// tags have changed
		if(changedTags) {
			req.tags = newForm.tags.map(tag => ({ ...tag }))
		}
	} else {
		req.tags = []
	}

	if(
		newForm.isPrivate !== oldForm.isPrivate
	) {
		req.isPrivate = newForm.isPrivate
	}

	return req
}

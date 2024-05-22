import { ROUTING_LIST_API } from '../../constants';

function buildTemplateContent(responses) {
  return responses.map(({ map }, index) => {
    const isTheLast = index === responses.length - 1;

    if (isTheLast) {
      return map?.result?.body;
    }

    return `<div class="page-break">${map?.result?.body}</div>`;
  });
}

export const getRoutingListTemplateContent = async (ky, routingLists) => {
  const routingListRequests = routingLists.map(({ id }) => ky.get(`${ROUTING_LIST_API}/${id}/template`).json());

  const templateData = await Promise.all(routingListRequests).then(buildTemplateContent);

  const templateBody = document.createElement('body');

  templateBody.innerHTML = templateData.join('');

  return templateBody;
};

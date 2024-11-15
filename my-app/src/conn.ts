const api_uri = "//127.0.0.1:5000/api/v1"

export function get_server_event_source() {
    return new EventSource(api_uri + "/events")
}

export async function get_api_request(req:string): Promise<any> {
  return await fetch(api_uri + req).then(async response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  })
}

export async function post_api_request(req:string, data:any): Promise<any> {
  const response = await fetch(api_uri + req, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json()
}
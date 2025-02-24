export function getIpFromRequest(request) {
    let ipaddress = request.headers['x-forwarded-for'] as string;

    if (!ipaddress) {
      ipaddress = request.ip; // x-forwarded-for 헤더가 없으면 기본 IP 사용
    } else {
      // x-forwarded-for 헤더가 있을 경우, 가장 앞에 있는 IP 주소를 사용
      ipaddress = ipaddress.split(',')[0].trim();
    }

    return ipaddress;
}
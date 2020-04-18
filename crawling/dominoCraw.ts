import request from 'request';
import { load } from 'cheerio';

// 테스트
export const crawl = () =>{
    request.get('https://naver.com', (err, res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res.body);
        }
    })
}

// crawl();

export const promiseCrawl = () =>{
    new Promise<string>((resolve, reject) =>{
        request.get('https://naver.com', (err, res)=>{
            if(err) reject(err);
            resolve(res.body);
        })
    })
}

export const extract = (html: string) =>{
    if(html == '') return [];
    const $ = load(html);
    const crawledRealtimeKeywords = $(
        '.ah_roll_area.PM_CL_realtimeKeyword_rolling ul > li span.ah_k',
    );

    const keywords: string[] = $(crawledRealtimeKeywords)
        .map(
            (i, ele): string =>{
                return $(ele).text();
            }
        )
        .get();
    return keywords;
}

console.log(promiseCrawl())

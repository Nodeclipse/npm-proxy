C:\Users\weibl>tracert isaacs.iriscouch.com

通过最多 30 个跃点跟踪
到 npm-dal01.sl.cdn.iriscouch.net [173.192.57.100] 的路由:

  1     1 ms     1 ms     3 ms  192.168.133.1
  2     1 ms    <1 毫秒    1 ms  192.168.10.254
  3     1 ms     1 ms     1 ms  172.30.30.13
  4     5 ms     7 ms     1 ms  10.255.41.101
  5     1 ms     1 ms     1 ms  124.205.97.173
  6     2 ms     2 ms     2 ms  218.241.165.169
  7     5 ms     2 ms     2 ms  202.99.1.145
  8     2 ms     2 ms     2 ms  202.99.1.125
  9    16 ms     6 ms     4 ms  106.3.103.1
 10     5 ms     *       16 ms  220.181.182.77
 11    11 ms     *        *     220.181.0.133
 12     6 ms     *        4 ms  220.181.16.17
 13     5 ms     9 ms     9 ms  202.97.53.162
 14    10 ms     9 ms     9 ms  202.97.53.246
 15   237 ms   239 ms   230 ms  202.97.51.158
 16   216 ms   219 ms   219 ms  202.97.50.34
 17     *        *        *     请求超时。
 18     *        *        *     请求超时。
 19     *      178 ms   189 ms  te2-5.bbr01.cs01.lax01.networklayer.com [4.26.070]
 20   316 ms   329 ms   339 ms  ae7.bbr01.cs01.lax01.networklayer.com [173.192.8.166]
 21     *      437 ms     *     ae19.bbr01.eq01.dal03.networklayer.com [173.19218.140]
 22     *        *      407 ms  ae0.dar02.sr01.dal01.networklayer.com [173.192.8.253]
 23   428 ms   429 ms     *     po2.fcr05.sr06.dal01.networklayer.com [66.228.18.223]
 24     *        *        *     请求超时。
 25   505 ms   489 ms   489 ms  173.192.57.100-static.reverse.softlayer.com [17.192.57.100]

跟踪完成。
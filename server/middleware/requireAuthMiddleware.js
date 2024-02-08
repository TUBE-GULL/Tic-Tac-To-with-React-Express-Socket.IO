const requireAuthMiddleware = (req, headers, next) => {
   const accessToken = headers.Authorization?.split('')[1];

   if (accessToken) {
      const userData = tokenService.validateAccessToken(accessToken);
      if (userData) {
         req.user = userData;
         return next()
      }
   }
   return next(apiError.U)
};


export default requireAuthMiddleware
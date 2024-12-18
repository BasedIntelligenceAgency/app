import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('OAuth Error:', error);
  
  if (error.response) {
    // Twitter API error
    return res
      .status(Number(error.response.status))
      .json({
        error: error.response.data.error || 'Twitter API error',
        details: error.response.data
      });
  }
  
  // Generic error
  res
    .status(500)
    .json({
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
}; 
using Microsoft.EntityFrameworkCore;
using System;

namespace PRID_Framework
{

    public class ValidationDbContextServiceProvider : IServiceProvider
    {

        private readonly DbContext _currContext;
        /// <summary>
        /// This creates the validation service provider
        /// </summary>
        /// <param name="currContext">The currect DbContext in which this validation is happening</param>
        public ValidationDbContextServiceProvider(DbContext currContext)
        {
            _currContext = currContext;
        }
        /// <summary>
        /// This implemenents the GetService part of the service provider. It only understands the type DbContext
        /// </summary>
        /// <param name="serviceType"></param>
        /// <returns></returns>
        public object GetService(Type serviceType)
        {
            if (serviceType == typeof(DbContext))
            {
                return _currContext;
            }
            return null;
        }
    }
}